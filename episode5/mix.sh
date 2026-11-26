#!/bin/bash
# ./mix.sh video.mp4 bed.wav sfx.wav out.mp4 [voice]
# Голос −16 LUFS (с задержкой 0,5 с), фон −35 LUFS (на 19 дБ тише голоса), эффекты −28 LUFS.
# Звук сводится ОТДЕЛЬНО от видео (иначе при склейке обрезался хвост), затем общий
# статический подъём до −14 LUFS и лимитер (без динамического loudnorm — он «проглатывал» тихий финал).
set -e
V=$1; BED=$2; SFX=$3; OUT=$4; VOICE=$5
TMP=$(mktemp -d)
if [ -n "$VOICE" ]; then
  ffmpeg -loglevel error -y -i "$VOICE" -i "$BED" -i "$SFX" -filter_complex \
  "[0:a]aresample=48000,adelay=500|500,loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[v];[1:a]loudnorm=I=-35:TP=-9,aresample=48000[b];[2:a]loudnorm=I=-28:TP=-6,aresample=48000[s];[v][b][s]amix=inputs=3:normalize=0:duration=longest[a]" \
  -map "[a]" "$TMP/mix.wav"
else
  ffmpeg -loglevel error -y -i "$BED" -i "$SFX" -filter_complex \
  "[0:a]loudnorm=I=-35:TP=-9,aresample=48000[b];[1:a]loudnorm=I=-28:TP=-6,aresample=48000[s];[b][s]amix=inputs=2:normalize=0[a]" \
  -map "[a]" "$TMP/mix.wav"
fi
G=$(ffmpeg -hide_banner -i "$TMP/mix.wav" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import json,sys;print(round(-14-float(json.load(sys.stdin)['input_i']),2))")
ffmpeg -loglevel error -y -i "$TMP/mix.wav" -af "volume=${G}dB,alimiter=limit=0.84:level=disabled:attack=1:release=50" "$TMP/final.wav"
ffmpeg -loglevel error -y -i "$V" -i "$TMP/final.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"
rm -rf "$TMP"
