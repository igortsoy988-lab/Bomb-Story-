#!/bin/bash
# ./mix.sh video.mp4 bed.wav sfx.wav out.mp4 [voice.mp3]
# Голос −16 LUFS, фон на 19 дБ тише (−35 LUFS), эффекты −28 LUFS, итог −14 LUFS, пик −1 dBTP.
set -e
V=$1; BED=$2; SFX=$3; OUT=$4; VOICE=$5
if [ -n "$VOICE" ]; then
  ffmpeg -y -loglevel error -i "$V" -i "$VOICE" -i "$BED" -i "$SFX" -filter_complex \
  "[1:a]aresample=48000,adelay=500|500,loudnorm=I=-16:TP=-2:LRA=11[v];[2:a]loudnorm=I=-35:TP=-9[b];[3:a]loudnorm=I=-28:TP=-6[s];\
[v][b][s]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
else
  ffmpeg -y -loglevel error -i "$V" -i "$BED" -i "$SFX" -filter_complex \
  "[1:a]loudnorm=I=-35:TP=-9[b];[2:a]loudnorm=I=-28:TP=-6[s];[b][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
fi
