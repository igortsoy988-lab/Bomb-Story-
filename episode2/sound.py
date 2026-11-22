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
s15 = T['lines'][18]['s']
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
def buzz(L_=0.9):
    n = int(L_*SR); tt = np.arange(n)/SR
    return np.sin(2*np.pi*180*tt)*(np.sin(2*np.pi*12*tt) > 0)*np.minimum(1, (L_-tt)/.05)*.6
def beep():
    n = int(.12*SR); tt = np.arange(n)/SR; return np.sin(2*np.pi*1800*tt)*env(n, .002, .05)
def glass():
    n = int(.8*SR); tt = np.arange(n)/SR; x = rng.standard_normal(n)*env(n, .0005, .05)
    for f in (3100, 4300, 5900, 7200): x += .3*np.sin(2*np.pi*f*tt + rng.random()*6)*env(n, .001, .25)
    return x
def heart():
    x = np.zeros(int(.8*SR)); b = boom()[:int(.25*SR)]*env(int(.25*SR), .005, .06)
    x[:len(b)] += b; x[int(.22*SR):int(.22*SR)+len(b)] += .7*b; return x
add(click(), wt(0, 'стекло'), .6)                       # ноготь по стеклу
add(boom()*.6, wt(3, 'фары'), .8)                      # удар света фар
for k in np.arange(L[4]['s'], end(4), .28): add(step(), k, .6)   # бег в лес
add(gust(5), L[6]['s'], .6); add(gust(4), L[7]['s'] + 1, .5)     # дым и ветер
add(creak(.6), L[8]['s'] + .3, .25)                     # компас
tz = wt(9, 'зазвон')
for i in range(10): add(buzz(), tz + i*.09, .35)       # телефоны разом
for k in np.arange(L[10]['s'], end(10), .5): add(beep(), k, .25)
add(glass(), wt(13, 'разбил') + .2, 1.0)               # разбитое стекло
for k in np.arange(wt(13, 'мигал'), end(14), .63): add(beep(), k, .3)    # маячок
for k in np.arange(L[15]['s'], end(15), .98): add(heart(), k, .7)        # «как сердце»
add(splash(), L[16]['s'] + .8, .7)
for k in np.arange(L[17]['s'], end(17), .45): add(step(), k, .45)
add(creak(1.0), L[18]['s'] + .4, .3)                   # полог палатки
add(gust(3)*.6, L[19]['s'], .3)
add(crack(), wt(20, 'видит') - .1, .7)                 # хруст ветки в темноте
sfx /= max(1e-9, np.abs(sfx).max())

def save(fn, x):
    x = np.clip(x, -1, 1); d = (x*32767*.9).astype('<i2')
    with wave.open(fn, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
save(sys.argv[2], bed); save(sys.argv[3], sfx); print('ok', round(dur, 2))
