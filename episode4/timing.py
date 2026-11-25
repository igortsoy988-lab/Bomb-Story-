# Тайминг без озвучки: по скорости чтения субтитров, ужимаем под целевую длину.
import json,re,sys
lines=[l for l in open(sys.argv[1],encoding='utf8').read().splitlines() if l.strip()]
target=float(sys.argv[3]) if len(sys.argv)>3 else 84
def build(k):
    t=0.6;out={'lines':[],'words':[]}
    for li,l in enumerate(lines):
        ls=None
        for w in l.split():
            if not re.search(r'[А-Яа-яЁё]',w): continue
            d=(0.10+0.055*len(re.sub(r'[^А-Яа-яЁё]','',w)))*k
            if ls is None: ls=t
            out['words'].append({'w':w,'s':round(t,3),'e':round(t+d,3),'line':li}); t+=d+0.04*k
            if re.search(r'[.!?…»]$',w): t+=0.45*k
            elif re.search(r'[,:—]$',w): t+=0.2*k
        out['lines'].append({'s':ls,'e':out['words'][-1]['e'],'text':l}); t+=0.35*k
    out['end']=round(t+3.5,2); return out
lo,hi=0.3,3
for _ in range(40):
    m=(lo+hi)/2; (lo,hi)=(m,hi) if build(m)['end']<target else (lo,m)
o=build(lo); json.dump(o,open(sys.argv[2],'w'),ensure_ascii=False); print('end',o['end'],'k',round(lo,3))
