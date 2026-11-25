# Синтез фона и эффектов (все звуки созданы кодом — общественное достояние, CC0).
# python3 sound.py timing.json bed.wav sfx.wav
import json, sys, re, wave
import numpy as np
SR = 48000
T = json.load(open(sys.argv[1], encoding='utf8'))
dur = T['end']; N = int(dur * SR); t = np.arange(N) / SR
rng = np.random.default_rng(7)

def lp(x, a):  # однополюсный фильтр низких частот
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y
def lp_fast(x, k):  # скользящее среднее (быстрый НЧ)
    c = np.cumsum(np.concatenate([[0], x])); return (c[k:] - c[:-k]) / k
def pad(x, n): return np.pad(x, (0, max(0, n - len(x))))[:n]

# ---- фон: низкий гул + «горячий ветер» ----
drone = (0.5*np.sin(2*np.pi*55*t) + 0.35*np.sin(2*np.pi*55.4*t) + 0.25*np.sin(2*np.pi*82.4*t + 0.3*np.sin(2*np.pi*0.07*t))
         + 0.12*np.sin(2*np.pi*110.3*t))
drone *= 0.6 + 0.4*np.sin(2*np.pi*0.05*t)**2
noise = rng.standard_normal(N)
wind = pad(lp_fast(lp_fast(noise, 40), 40), N)
wind *= 0.5 + 0.5*(0.5 + 0.5*np.sin(2*np.pi*0.11*t + 1.3*np.sin(2*np.pi*0.031*t)))
wind /= np.abs(wind).max()
bed = 0.55*drone/np.abs(drone).max() + 0.6*wind
# тревожный высокий тон к финалу (с чемодана)
s15 = T['lines'][17]['s']
rise = np.clip((t - s15) / 8, 0, 1)
bed += 0.12*rise*np.sin(2*np.pi*220*t)*(0.5+0.5*np.sin(2*np.pi*3*t))
fade = np.minimum(1, t/1.5) * np.minimum(1, (dur - t)/0.5)
bed *= fade; bed /= np.abs(bed).max()

# ---- эффекты ----
sfx = np.zeros(N)
def add(x, at, g=1.0):
    i = int(at*SR); j = min(N, i+len(x))
    if i < N and j > i: sfx[i:j] += g*x[:j-i]
def env(n, a=0.002, d=0.1):
    tt = np.arange(n)/SR; return np.minimum(1, tt/a)*np.exp(-tt/d)
def step():
    n = int(.18*SR); x = pad(lp_fast(rng.standard_normal(n+20), 20), n)
    return x*env(n, .004, .04) * 3
def crack():
    n = int(.35*SR); x = rng.standard_normal(n)*env(n, .0005, .03)
    for k in range(3): x += np.roll(rng.standard_normal(n)*env(n, .0005, .015), int((.05+.06*k)*SR))*.7
    return x
def gust(L=3.0):
    n = int(L*SR); x = pad(lp_fast(lp_fast(rng.standard_normal(n+80), 40), 40), n)
    e = np.sin(np.pi*np.arange(n)/n)**2; return x/np.abs(x).max()*e
def click():
    n = int(.08*SR); tt = np.arange(n)/SR; return (np.sin(2*np.pi*2200*tt)+.5*rng.standard_normal(n))*env(n, .0003, .008)
def creak(L=0.9):
    n = int(L*SR); tt = np.arange(n)/SR; f = 180 + 60*np.sin(2*np.pi*1.3*tt)
    ph = np.cumsum(2*np.pi*f/SR); saw = (ph/(2*np.pi)) % 1 * 2 - 1
    pulses = (np.sin(2*np.pi*35*tt) > .6).astype(float)
    return pad(lp_fast(saw*pulses, 6), n) * np.sin(np.pi*tt/L)
def boom():
    n = int(2.5*SR); tt = np.arange(n)/SR
    return (np.sin(2*np.pi*(45-15*tt)*tt) + .4*pad(lp_fast(rng.standard_normal(n+200), 200), n)*8) * env(n, .01, .7)
def splash():
    n = int(.6*SR); return pad(lp_fast(rng.standard_normal(n+5), 5), n)*env(n, .01, .15)*.6

def wt(li, prefix):
    for w in T['words']:
        if w['line'] == li and re.sub(r'[^а-яё]', '', w['w'].lower()).startswith(prefix): return w['s']
    return T['lines'][li]['s']
L = T['lines']; end = lambda i: L[i+1]['s'] if i+1 < len(L) else T['end']
def beep():
    n = int(.12*SR); tt = np.arange(n)/SR; return np.sin(2*np.pi*1800*tt)*env(n, .002, .05)
def heart():
    x = np.zeros(int(.8*SR)); b = boom()[:int(.25*SR)]*env(int(.25*SR), .005, .06)
    x[:len(b)] += b; x[int(.22*SR):int(.22*SR)+len(b)] += .7*b; return x
def crackle(L_):  # треск костра
    n = int(L_*SR); x = np.zeros(n)
    for _ in range(int(L_*14)):
        i = rng.integers(0, n-2000); c = click()*rng.uniform(.2, .8); x[i:i+len(c)] += c[:n-i]
    return x + .15*pad(lp_fast(rng.standard_normal(n+30), 30), n)*6
def whistle(L_=1.2):  # свист падения
    n = int(L_*SR); tt = np.arange(n)/SR; f = 2600 - 1900*tt/L_
    return np.sin(np.cumsum(2*np.pi*f/SR))*np.minimum(1, tt/.3)*.5
def geiger(L_, rate):  # треск дозиметра
    n = int(L_*SR); x = np.zeros(n); t0 = 0.0
    while True:
        t0 += rng.exponential(1/rate(t0/L_))
        i = int(t0*SR)
        if i >= n-400: break
        x[i:i+400] += rng.standard_normal(400)*env(400, .0001, .0008)
    return x
def clank():
    n = int(.9*SR); tt = np.arange(n)/SR
    return (sum(np.sin(2*np.pi*f*tt) for f in (310, 742, 1180))*env(n, .001, .18) + boom()[:n]*.5)
add(gust(5)*.6, L[0]['s'], .35)
add(creak(.6), wt(1, 'пропуск'), .3); add(creak(.8), wt(1, 'карта'), .35)          # шуршание бумаги
for k in np.arange(wt(2, 'одна'), end(2), .5): add(beep(), k, .25)
add(boom()*.5, L[3]['s'] + .3, .5)
for k in np.arange(L[4]['s'], end(4), .98): add(heart(), k, .4)
add(gust(4), L[5]['s'], .5)
for k in np.arange(L[6]['s'], end(6), .45): add(step(), k, .45)
add(boom()*.6, wt(7, 'схватил'), .6)
for k in np.arange(L[8]['s'], end(8), .98): add(heart(), k, .4)
add(click(), L[9]['s'], .6); add(click(), wt(9, 'стекло'), .6); add(clank()*.5, wt(9, 'это'), .4)
for k in np.arange(wt(10, 'настоящий'), end(10), .98): add(heart(), k, .5)
add(creak(.6), L[11]['s'] + .2, .3)
add(crack(), L[12]['s'], 1.0); add(crack(), L[12]['s'] + .35, .6)
for k in np.arange(L[12]['s'] + .6, end(12), .3): add(step(), k, .5)
for w in [x for x in T['words'] if x['line'] == 14][:3]: add(boom()[:int(.3*SR)], w['s'], .9); add(crack(), w['s'] + .05, .5)
add(boom()*.6, L[15]['s'] + .5, .6)
for k in np.arange(L[16]['s'], end(16), .5): add(step(), k, .5)
add(splash()*.4, wt(16, 'воду'), .3)
add(boom()*.4, L[17]['s'], .4)
add(step(), wt(18, 'честь') - .2, .7); add(click(), wt(18, 'честь'), .5)
for k in [L[20]['s'] + .6 + .45*i for i in range(4)]: add(click(), k, .7)
add(heart(), L[20]['e'] + .3, .8)
te = L[20]['e'] + 1.0                                   # заставка «Серия 5 — скоро»
add(boom(), te, 1.0); add(gust(2.5)*.5, te, .5)
n = int((T['end'] - te)*SR); tt = np.arange(n)/SR
add((np.sin(2*np.pi*55*tt) + .5*np.sin(2*np.pi*82.4*tt))*np.minimum(1, tt/.3)*.5, te, .8)
sfx /= max(1e-9, np.abs(sfx).max())

def save(fn, x):
    x = np.clip(x, -1, 1); d = (x*32767*.9).astype('<i2')
    with wave.open(fn, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
save(sys.argv[2], bed); save(sys.argv[3], sfx); print('ok', round(dur, 2))
