# Озвучка серии через ElevenLabs (with-timestamps) + тайминг слов для анимации.
# python3 voice.py ТЕКСТ.txt теги.txt voice_id out.mp3 timing.json
import json, re, sys, base64, subprocess, urllib.request
txt, tags, vid, out_mp3, out_t = sys.argv[1:6]
lines = [l for l in open(txt, encoding='utf8').read().splitlines() if l.strip()]
tg = [l for l in open(tags, encoding='utf8').read().splitlines() if l.strip()]
assert len(tg) == len(lines)
# тег строки + текст; [pause] внутри строки по месту « — » не трогаем
parts = []; spans = []  # spans: (line, word, start_char, end_char)
req = ''
for li, (l, t) in enumerate(zip(lines, tg)):
    pre = t + ' '
    req += pre
    for m in re.finditer(r'\S+', l):
        w = m.group(0)
        if re.search(r'[А-Яа-яЁё]', w): spans.append((li, w, len(req) + m.start(), len(req) + m.end()))
    req += l + '\n'
body = json.dumps({'text': req, 'model_id': 'eleven_v3', 'language_code': 'ru',
                   'voice_settings': {'stability': 0.5, 'similarity_boost': 0.75}}).encode()
r = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}/with-timestamps?output_format=mp3_44100_128',
                           data=body, headers={'xi-api-key': 'sk_proxyinjected', 'Content-Type': 'application/json'})
d = json.load(urllib.request.urlopen(r, timeout=300))
open(out_mp3, 'wb').write(base64.b64decode(d['audio_base64']))
al = d.get('alignment') or d.get('normalized_alignment')
ch, cs, ce = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
print('chars req', len(req), 'align', len(ch))
# сопоставление: если длины совпали — по индексам, иначе последовательным поиском слов
if ''.join(ch) == req:
    idx = list(range(len(req)))
    def tm(a, b): return cs[a], ce[b - 1]
else:
    al_s = ''.join(ch); pos = 0
    def tm(a, b):
        global pos
        w = req[a:b]; k = al_s.find(w, pos)
        if k < 0: k = al_s.find(re.sub(r'[^\w]', '', w), pos)
        if k < 0: return None
        pos = k + len(w); return cs[k], ce[min(len(ce) - 1, k + len(w) - 1)]
OFF = 0.5  # голос начинается с задержкой 0.5 с (см. mix.sh)
words = []
for li, w, a, b in spans:
    r_ = tm(a, b)
    if r_ is None: r_ = (words[-1]['e'] - OFF, words[-1]['e'] - OFF + .3)
    words.append({'w': w, 's': round(r_[0] + OFF, 3), 'e': round(r_[1] + OFF, 3), 'line': li})
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out_mp3]))
T = {'lines': [], 'words': words}
for li, l in enumerate(lines):
    ws = [w for w in words if w['line'] == li]
    T['lines'].append({'s': ws[0]['s'], 'e': ws[-1]['e'], 'text': l})
T['end'] = round(dur + OFF + 3.0, 2)
json.dump(T, open(out_t, 'w'), ensure_ascii=False)
print('voice', round(dur, 2), 'end', T['end'])
