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

add(boom(), 0.0, .9)                                  # гул удара в начале
add(gust(4), L[1]['s'] - .3, .5)                       # ветер над посёлком
for k in np.arange(L[2]['s'], end(2), .42): add(step(), k, .5)   # шаги Никиты
add(gust(3), L[3]['s'], .4)
add(crack(), wt(7, 'хрустнул'), 1.0)                   # хруст ветки
for k in np.arange(L[8]['s'], end(8), .28): add(step(), k, .6)   # бег по оврагу
add(gust(4), L[9]['s'], .7)                            # горячий ветер
add(splash(), L[9]['s'] + 1.4, .5)
add(creak(.5), wt(10, 'отдал'), .25)                    # пластик бутылки
add(boom()*.5, L[11]['s'], .6)                          # прожекторы включаются
for k in np.arange(L[12]['s'], end(12), .45): add(step(), k, .45)
add(creak(.9), wt(14, 'отдал'), .3)
add(click(), wt(15, 'открыл') - .25, .9); add(click(), wt(15, 'открыл') - .1, .9)  # замки чемодана
add(creak(1.1), wt(15, 'открыл'), .5)                  # скрип крышки
add(gust(5), L[17]['s'], .6)
sfx /= max(1e-9, np.abs(sfx).max())

def save(fn, x):
    x = np.clip(x, -1, 1); d = (x*32767*.9).astype('<i2')
    with wave.open(fn, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
save(sys.argv[2], bed); save(sys.argv[3], sfx); print('ok', round(dur, 2))
