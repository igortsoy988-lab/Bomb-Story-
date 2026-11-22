# Оценка таймингов слов до появления настоящей озвучки (≈ темп диктора).
import json,re,sys
lines=[l for l in open(sys.argv[1],encoding='utf8').read().splitlines() if l.strip()]
t=0.5; out={'lines':[],'words':[]}
for li,l in enumerate(lines):
    parts=re.split(r'(\[[^\]]*\])',l); ls=None
    for p in parts:
        if p.startswith('['):
            if 'длинная пауза' in p: t+=1.6
            elif 'пауза' in p: t+=0.7
            continue
        for w in p.split():
            if not re.search(r'[А-Яа-яЁё]',w): continue
            d=0.08+0.05*len(re.sub(r'[^А-Яа-яЁё]','',w))
            if ls is None: ls=t
            out['words'].append({'w':w,'s':round(t,3),'e':round(t+d,3),'line':li}); t+=d+0.04
            if re.search(r'[.!?…]$',w): t+=0.35
            elif re.search(r'[,:—]$',w): t+=0.15
    out['lines'].append({'s':ls,'e':out['words'][-1]['e'],'text':re.sub(r'\[[^\]]*\]','',l).strip()}); t+=0.25
out['end']=round(t+3.0,2)
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,indent=0); print('end',out['end'],'words',len(out['words']))
