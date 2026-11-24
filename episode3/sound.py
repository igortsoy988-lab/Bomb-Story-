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
s15 = T['lines'][15]['s']
rise = np.clip((t - s15) / 8, 0, 1)
bed += 0.12*rise*np.sin(2*np.pi*220*t)*(0.5+0.5*np.sin(2*np.pi*3*t))
fade = np.minimum(1, t/1.5) * np.minimum(1, (dur - t)/1.5)
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
add(gust(4), L[0]['s'], .4); add(creak(.7), wt(0, 'блеснул'), .2)
add(crackle(end(3) - L[2]['s']), L[2]['s'], .45)        # костёр
for k in np.arange(L[3]['s'], end(3), 1.0): add(heart(), k, .35)   # пульс осколка
add(crackle(end(5) - L[4]['s'])*.3, L[4]['s'], .3)
add(step(), wt(4, 'шорох'), .5); add(step(), wt(4, 'шорох') + .5, .4)
add(click(), wt(5, 'щипцы'), .8); add(click(), wt(5, 'щипцы') + .15, .6)            # щипцы
for k in np.arange(wt(6, 'ушёл'), end(6), .45): add(step(), k, .4)
add(gust(3)*.6, L[7]['s'], .4)
add(whistle(1.3), wt(8, 'свистом') - .3, .8); add(boom(), wt(8, 'упал') + .3, .9)   # падение
add(splash()*.5, L[9]['s'] + .2, .4)                     # шипение в росе
add(geiger(end(10) - L[10]['s'], lambda q: 8 + 30*q)*.6, L[10]['s'], .35)          # искры на экране
for k in np.arange(L[11]['s'], L[11]['s'] + 2, .45): add(step(), k, .45)
add(creak(.5), wt(13, 'перчатки'), .25); add(click(), wt(13, 'щипцы'), .7); add(clank(), wt(13, 'свинцовый') + .3, .6)
add(geiger(end(14) - L[14]['s'] + .5, lambda q: 15 + 120*q), L[14]['s'], .9)       # дозиметр
add(boom()*.7, wt(15, 'радиоакт'), .7)
for w in [x for x in T['words'] if x['line'] == 16 and x['w'].lower().startswith('поэтому')]: add(click(), w['s'], .8); add(boom()[:int(.4*SR)]*.4, w['s'], .5)
add(step(), wt(17, 'отшвырнул') + .1, .9); add(splash()*.3, wt(17, 'отшвырнул') + 1.0, .3)
add(gust(5)*.5, L[18]['s'], .35)
for k in np.arange(L[18]['s'], L[18]['s'] + 3, .5): add(step(), k, .35)
add(heart(), L[20]['s'] + 1.5, .6); add(heart(), L[20]['s'] + 2.5, .7); add(heart(), L[20]['s'] + 3.5, .8)
sfx /= max(1e-9, np.abs(sfx).max())

def save(fn, x):
    x = np.clip(x, -1, 1); d = (x*32767*.9).astype('<i2')
    with wave.open(fn, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
save(sys.argv[2], bed); save(sys.argv[3], sfx); print('ok', round(dur, 2))
