// Новая графика серии 2. Стиль и палитра — из episode1/art.js (его не меняем).
const A1=require('../episode1/art.js');const P=A1.P;
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647;}}
// поддельный камень: ровный свет (краска)
function fakeShard(x,y,s=1,a=1){return `<g transform="translate(${x},${y}) scale(${s})" opacity="${a}"><circle r="60" fill="url(#glowR)" opacity=".55"/>
 <path d="M-26,8 L-10,-30 L18,-24 L30,4 L8,30 L-20,26Z" fill="#4fd8b4"/><path d="M-10,-30 L18,-24 L4,0 L-26,8Z" fill="#a8ffe8"/></g>`;}
// настоящий осколок: тёмный, неровный, пульсирует изнутри (p 0..1)
function realShard(x,y,s=1,p=1){return `<g transform="translate(${x},${y}) scale(${s})"><circle r="${70+30*p}" fill="url(#glowR)" opacity="${.35+.5*p}"/>
 <path d="M-34,6 L-22,-28 L4,-38 L30,-18 L36,10 L14,34 L-18,30Z" fill="#1a1d22"/>
 <path d="M-20,-4 L-6,-22 L10,-10 L4,8Z M8,14 L22,-2 L26,14Z M-18,14 L-4,20 L-12,26Z" fill="#6dffd2" opacity="${.4+.6*p}"/></g>`;}
// разбитая подделка с маячком (blink 0/1)
function brokenFake(x,y,s=1,blink=1){return `<g transform="translate(${x},${y}) scale(${s})">
 <path d="M-60,10 L-40,-30 L-10,-20 L-20,20Z" fill="#a8ffe8" opacity=".7"/><path d="M20,-28 L58,-14 L44,22 L14,8Z" fill="#4fd8b4" opacity=".7"/><path d="M-14,26 L16,18 L8,44Z" fill="#a8ffe8" opacity=".6"/>
 <rect x="-22" y="-14" width="44" height="28" rx="3" fill="#1d4a2a"/><path d="M-16,-6 h12 M-16,4 h20 M6,-6 v14" stroke="#c9a24a" stroke-width="2"/>
 <circle cx="12" cy="0" r="5" fill="${blink?'#ff2a2a':'#4a0e0e'}"/>${blink?'<circle cx="12" cy="0" r="22" fill="#ff2a2a" opacity=".35" filter="url(#blur8)"/>':''}</g>`;}
function compass(x,y,s=1,ang=0){return `<g transform="translate(${x},${y}) scale(${s})">
 <circle r="150" fill="#5a4a30"/><circle r="130" fill="#e8e0c8"/><circle r="130" fill="none" stroke="#2a2a2a" stroke-width="4"/>
 ${[0,90,180,270].map(a=>`<rect x="-3" y="-128" width="6" height="22" fill="#222" transform="rotate(${a})"/>`).join('')}
 <text y="-90" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#a01818">С</text>
 <g transform="rotate(${ang})"><path d="M0,-110 L14,0 L-14,0Z" fill="#c42020"/><path d="M0,110 L14,0 L-14,0Z" fill="#334"/></g><circle r="10" fill="#222"/>
 <ellipse cx="-50" cy="-60" rx="40" ry="18" fill="#fff" opacity=".25" transform="rotate(-30 -50 -60)"/></g>`;}
function phone(x,y,s=1,o={}){const blink=o.blink??1;return `<g transform="translate(${x},${y}) scale(${s})">
 <rect x="-160" y="-320" width="320" height="640" rx="40" fill="#101216"/><rect x="-144" y="-296" width="288" height="592" rx="26" fill="#0d1a24"/>
 ${(()=>{let s='';const r=rnd(5);for(let i=0;i<14;i++){s+=`<path d="M${-144+r()*288},${-200+r()*480} q${40-r()*80},${30} ${80-r()*40},${-10}" stroke="#1d3a4a" stroke-width="6" fill="none"/>`}return s})()}
 <rect x="-130" y="-280" width="260" height="110" rx="18" fill="#e9eef3"/>
 <text x="-112" y="-240" font-family="Inter" font-weight="900" font-size="26" fill="#b01818">⚠ ОПОВЕЩЕНИЕ</text>
 <text x="-112" y="-200" font-family="Inter" font-weight="700" font-size="21" fill="#111">Новая точка падения</text>
 <circle cx="20" cy="120" r="${blink?22:16}" fill="#ff3030"/><circle cx="20" cy="120" r="${blink?60:30}" fill="#ff3030" opacity=".3"/>
 <circle cx="-30" cy="170" r="14" fill="#3aa0ff" stroke="#fff" stroke-width="4"/><text x="-30" y="215" text-anchor="middle" font-family="Inter" font-size="20" fill="#9cc8ff">вы здесь</text></g>`;}
// прицел со светящейся краской
function scope(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-260" y="-50" width="520" height="100" rx="40" fill="#1c201a"/><circle cx="-260" r="80" fill="#262b22"/><circle cx="-260" r="60" fill="#0a0d0b"/>
 <path d="M-300,0 h80 M-260,-40 v80" stroke="#6dffd2" stroke-width="5"/><circle cx="-260" r="8" fill="#6dffd2"/><circle cx="-260" r="60" fill="url(#glowR)" opacity=".4"/></g>`;}
function cash(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-30" width="120" height="60" rx="6" fill="#4a6a3a"/><rect x="-50" y="-22" width="100" height="44" fill="none" stroke="#7a9a5a" stroke-width="4"/><rect x="-12" y="-34" width="24" height="68" fill="#c9b27a"/></g>`;}
function kettle(x,y,s=1,t=0){let st='';for(let i=0;i<4;i++){const k=(t*.5+i/4)%1;st+=`<circle cx="${70+k*60+Math.sin(t*3+i)*10}" cy="${-90-k*220}" r="${14+k*30}" fill="#d8dde0" opacity="${.4*(1-k)}" filter="url(#blur8)"/>`}
 return `<g transform="translate(${x},${y}) scale(${s})">
 ${[...Array(7)].map((_,i)=>`<rect x="${-110+i*30}" y="20" width="90" height="16" rx="8" fill="#2a1a10" transform="rotate(${i*25-70} ${-70+i*30} 28)"/>`).join('')}
 <ellipse cx="0" cy="34" rx="110" ry="24" fill="#ff5a1a" opacity=".55" filter="url(#blur8)"/>${[...Array(9)].map((_,i)=>`<circle cx="${-80+i*20}" cy="${30+(i%3)*4}" r="7" fill="${i%2?'#ff7a2a':'#c43a10'}"/>`).join('')}
 <path d="M-70,0 Q-80,-110 0,-112 Q80,-110 70,0Z" fill="#3a3f46"/><path d="M-40,-112 Q0,-170 40,-112" stroke="#22262b" stroke-width="10" fill="none"/>
 <path d="M60,-60 L118,-96 L110,-82 L66,-40Z" fill="#3a3f46"/><path d="M-60,-30 Q0,-20 60,-30" stroke="#5a6068" stroke-width="5" fill="none"/>${st}</g>`;}
function tent(x,y,s=1,p=1,open=1){let st='';const r=rnd(9);for(let i=0;i<46;i++){const xx=-190+r()*380,yy=-20-r()*(150-Math.abs(xx)*.5);const pp=.5+.5*Math.sin(p*6+i);st+=`<g transform="translate(${xx},${yy}) rotate(${r()*360}) scale(.6)"><path d="M-34,6 L-22,-28 L4,-38 L30,-18 L36,10 L14,34 L-18,30Z" fill="#1a1d22"/><path d="M-20,-4 L-6,-22 L10,-10 L4,8Z" fill="#6dffd2" opacity="${.3+.7*pp}"/></g>`}
 return `<g transform="translate(${x},${y}) scale(${s})">
 <path d="M-330,0 L0,-360 L330,0Z" fill="#3e4a36"/><path d="M0,-360 L330,0 L170,0Z" fill="#323c2b"/>
 <path d="M-240,0 L0,-280 L240,0Z" fill="#0a0e0c"/><ellipse cx="0" cy="-60" rx="220" ry="120" fill="url(#glowR)" opacity="${.35+.25*Math.sin(p*3)}"/>${st}
 <path d="M0,-280 L${-240+ (1-open)*240},0 L${-330+(1-open)*90},0Z" fill="#46533d"/>
 <path d="M-340,0 L-420,40 M340,0 L420,40" stroke="#777" stroke-width="3"/></g>`;}
function bgFallen(seed=3){const r=rnd(seed);let logs='';for(let i=0;i<14;i++){const x=r()*1300-100,y=1250+r()*450,a=(x-540)*.06+r()*20-10;logs+=`<g transform="translate(${x},${y}) rotate(${a})"><rect x="-260" y="-24" width="520" height="48" rx="20" fill="${i%2?'#2a1d14':'#3a2819'}"/><rect x="-250" y="-24" width="500" height="10" rx="5" fill="#5a3d24" opacity=".6"/><circle cx="-260" r="24" fill="#7a5634"/><circle cx="-260" r="12" fill="#5a3d24"/></g>`}
 let stumps='';for(let i=0;i<7;i++){const x=60+i*160+r()*40;stumps+=`<path d="M${x-26},1240 L${x-20},${1100-r()*80} L${x-4},${1150} L${x+8},${1090-r()*60} L${x+26},1240Z" fill="#0d0a08"/>`}
 return `<rect width="1080" height="1920" fill="#120e10"/><circle cx="540" cy="1000" r="700" fill="url(#emberR)" opacity=".3"/>
 <rect y="1200" width="1080" height="720" fill="#0e0b0a"/>${stumps}${logs}
 ${[...Array(6)].map((_,i)=>`<ellipse cx="${i*200}" cy="${1100+i%2*120}" rx="320" ry="120" fill="#4a4048" opacity=".22" filter="url(#blur40)"/>`).join('')}`;}
function bgTent(){return `${A1.bgForest(71)}<path d="M0,1500 Q540,1380 1080,1500 L1080,1920 L0,1920Z" fill="#0a0f0d"/>`;}
module.exports={fakeShard,realShard,brokenFake,compass,phone,scope,cash,kettle,tent,bgFallen,bgTent};
