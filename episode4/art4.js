// Новая графика серии 4. Стиль — из прошлых серий (их файлы не меняем).
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647;}}
function pass(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-170" y="-110" width="340" height="220" rx="14" fill="#c9c2a8"/><rect x="-170" y="-110" width="340" height="44" rx="14" fill="#7a2a24"/>
 <text x="0" y="-80" text-anchor="middle" font-family="Inter" font-weight="900" font-size="24" fill="#f0e6c8">ПРОПУСК № 0017</text>
 <rect x="-150" y="-50" width="100" height="130" fill="#8a8470"/><circle cx="-100" cy="-10" r="26" fill="#6a6450"/><path d="M-140,70 Q-100,20 -60,70Z" fill="#6a6450"/>
 <text x="-30" y="-30" font-family="Inter" font-size="20" fill="#333">Фамилия:</text><rect x="-30" y="-20" width="170" height="3" fill="#555"/>
 <text x="-30" y="20" font-family="Inter" font-size="20" fill="#333">Допуск:</text><text x="60" y="20" font-family="Inter" font-weight="900" font-size="24" fill="#7a2a24">«А»</text>
 <circle cx="100" cy="70" r="30" fill="none" stroke="#7a2a24" stroke-width="5" opacity=".7"/></g>`;}
// карта: k — сколько букв «ЯДРО» видно (1..4), hl — подсветка точки оповещения
function map(x,y,s=1,o={}){const k=o.k??1,hl=o.hl??0;const r=rnd(4);let roads='';for(let i=0;i<6;i++)roads+=`<path d="M${-300+r()*100},${-360+i*130} q${200},${-60+r()*120} ${600},${r()*80-40}" stroke="#8a7a5a" stroke-width="3" fill="none" stroke-dasharray="10 6"/>`;
 let tr='';for(let i=0;i<80;i++)tr+=`<circle cx="${-320+r()*640}" cy="${-420+r()*840}" r="${6+r()*8}" fill="#9fae86" opacity=".6"/>`;
 const pts=[[-180,-250],[200,-180],[-90,240],[230,260],[150,40]];
 return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-340" y="-440" width="680" height="880" fill="#e4dcc0"/><path d="M-340,-440 L340,-440 L340,440 L-340,440Z" fill="none" stroke="#a89a70" stroke-width="8"/>
 <path d="M-340,-140 h680 M-340,150 h680 M-110,-440 v880 M120,-440 v880" stroke="#c8bd98" stroke-width="3"/>${tr}${roads}
 <path d="M-340,60 Q-100,0 40,120 T340,90" stroke="#6a8fbf" stroke-width="10" fill="none"/>
 ${pts.map(([px,py],i)=>`<circle cx="${px}" cy="${py}" r="${i===4&&hl?26:16}" fill="#c01818"/>${i===4&&hl?`<circle cx="${px}" cy="${py}" r="60" fill="none" stroke="#ff3030" stroke-width="5"/>`:''}`).join('')}
 <circle cx="0" cy="-20" r="120" fill="none" stroke="#111" stroke-width="9"/><text x="${k>1?-0:0}" y="12" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${k>1?64:96}" fill="#111">${'ЯДРО'.slice(0,k)}</text>
 <text x="300" y="410" text-anchor="end" font-family="Inter" font-weight="700" font-size="26" fill="#333">${o.date||'14.08 — за 7 дней'}</text></g>`;}
function bgRoad(seed=21){const r=rnd(seed);let t='';for(let i=0;i<10;i++){const x=r()*1080,w=30+r()*40;t+=`<rect x="${x}" y="0" width="${w}" height="${700+r()*200}" fill="#0f1a16"/>`}
 let slabs='';for(let i=0;i<9;i++){const yy=1180+i*i*12+i*40,w=200+i*i*14+i*40;slabs+=`<path d="M${540-w/2},${yy} L${540+w/2},${yy} L${540+(w+60)/2},${yy+30+i*10} L${540-(w+60)/2},${yy+30+i*10}Z" fill="${i%2?'#4a4e52':'#55595e'}"/><path d="M${540-w/2+20},${yy+4} l${30+i*6},0" stroke="#2a3a2a" stroke-width="${4+i}"/>`}
 return `<defs><linearGradient id="mist4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3442"/><stop offset=".55" stop-color="#7a8696"/><stop offset=".62" stop-color="#b8a690"/></linearGradient></defs>
 <rect width="1080" height="1920" fill="url(#mist4)"/>${t}<rect y="1150" width="1080" height="770" fill="#1a2420"/>${slabs}
 ${[...Array(5)].map((_,i)=>`<ellipse cx="${i*260}" cy="${1150+i%2*50}" rx="400" ry="100" fill="#c8ccd8" opacity=".2" filter="url(#blur40)"/>`).join('')}`;}
function bgRavineEdge(){return `<rect width="1080" height="1920" fill="#1a2420"/><path d="M0,0 L1080,0 L1080,700 Q800,760 540,720 Q260,690 0,760Z" fill="#232e28"/>
 <path d="M0,760 Q260,690 540,720 Q800,760 1080,700 L1080,1920 L0,1920Z" fill="#050807"/><path d="M200,1920 Q400,1300 540,1250 Q700,1300 880,1920Z" fill="#020303"/>`;}
function truck(x,y,s=1,lights=1){return `<g transform="translate(${x},${y}) scale(${s})">
 <rect x="-360" y="-260" width="430" height="240" rx="10" fill="#2b3121"/><path d="M-360,-260 Q-145,-330 70,-260Z" fill="#323a27"/>
 <rect x="70" y="-200" width="200" height="180" rx="16" fill="#323a27"/><rect x="110" y="-180" width="120" height="70" rx="6" fill="#1b2532"/><rect x="250" y="-60" width="40" height="30" rx="6" fill="#1a1d14"/>
 <circle cx="282" cy="-80" r="18" fill="${lights?'#fff6d0':'#555'}"/>${lights?'<circle cx="282" cy="-80" r="80" fill="#fff6d0" opacity=".25" filter="url(#blur20)"/>':''}
 ${[-280,-150,180].map(cx=>`<circle cx="${cx}" cy="0" r="52" fill="#0a0b08"/><circle cx="${cx}" cy="0" r="20" fill="#2a2d24"/>`).join('')}
 <text x="-145" y="-120" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#1e2318">В/Ч 0017</text></g>`;}
// офицер в фуражке; salute 0..1
function officer(o={}){const k=o.salute||0;const P={skin:'#c99a7a'};
 return `<g class="officer"><rect x="-54" y="-190" width="42" height="190" rx="10" fill="#22281c"/><rect x="12" y="-190" width="42" height="190" rx="10" fill="#22281c"/>
 <path d="M-84,-410 Q0,-434 84,-410 L90,-170 L-90,-170Z" fill="#3a4430"/><rect x="-86" y="-416" width="40" height="16" rx="4" fill="#c9a24a"/><rect x="46" y="-416" width="40" height="16" rx="4" fill="#c9a24a"/>
 <circle cx="0" cy="-350" r="6" fill="#c9a24a"/><circle cx="0" cy="-300" r="6" fill="#c9a24a"/><rect x="-90" y="-210" width="180" height="16" fill="#1a1d14"/>
 <g transform="rotate(${10-k*10} -80 -400)"><rect x="-102" y="-400" width="34" height="200" rx="15" fill="#3a4430"/><circle cx="-85" cy="-196" r="17" fill="${P.skin}"/></g>
 <g transform="rotate(${-8-k*150} 80 -400)"><rect x="68" y="-400" width="34" height="200" rx="15" fill="#3a4430"/><circle cx="85" cy="-196" r="17" fill="${P.skin}"/></g>
 <rect x="-18" y="-436" width="36" height="30" fill="#a77a5e"/><ellipse cx="0" cy="-482" rx="48" ry="56" fill="${P.skin}"/>
 <ellipse cx="-14" cy="-488" rx="5" ry="6" fill="#111"/><ellipse cx="14" cy="-488" rx="5" ry="6" fill="#111"/><path d="M-24,-502 L-6,-498 M6,-498 L24,-502" stroke="#222" stroke-width="6" stroke-linecap="round"/><path d="M-10,-458 h20" stroke="#5a3a2c" stroke-width="4"/>
 <path d="M-70,-522 Q0,-600 70,-522 Z" fill="#3a4430"/><rect x="-74" y="-530" width="148" height="20" rx="8" fill="#7a1d1d"/><path d="M-60,-512 Q0,-486 60,-512 L50,-506 Q0,-490 -50,-506Z" fill="#111"/><circle cx="0" cy="-546" r="10" fill="#c9a24a"/></g>`;}
// воспоминание: руки в оливковых рукавах укладывают стекляшки в чемодан
function memoryCase(t=0,fakeShard){let st='';for(let r=0;r<3;r++)for(let c=0;c<6;c++)st+=fakeShard(250+c*120+(r%2)*50,1130+r*100,.7,.9);
 return `<rect width="1080" height="1920" fill="#06120f"/><rect x="100" y="1000" width="880" height="420" rx="24" fill="#9aa3ad"/><rect x="130" y="1030" width="820" height="360" rx="12" fill="#1a2422"/>${st}
 <g transform="translate(${540+Math.sin(t*2)*60},${900+Math.abs(Math.sin(t*2))*60})"><rect x="-300" y="-60" width="260" height="100" rx="40" fill="#4a5236"/><ellipse cx="-30" cy="-10" rx="70" ry="50" fill="#c99a7a"/>${fakeShard(10,10,1.1)}</g>`;}
module.exports={pass,map,bgRoad,bgRavineEdge,truck,officer,memoryCase};
