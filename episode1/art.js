// Общая графика сериала «Падение метеорита». Плоский 2D, тёмная палитра.
// Персонажи: ноги в (0,0), рост ~560 ед. Фоны: 1080x1920.
const P = {
  night:'#070b14', night2:'#0e1526', forest:'#0f1b18', forest2:'#16261f', trunk:'#0a120f',
  ember:'#ff7a2a', ember2:'#ffb347', glow:'#6dffd2', glowDim:'#2fae8f',
  skin:'#c99a7a', skinShade:'#a77a5e', grey:'#b9bcc2', ink:'#05070c'
};
function face({x=0,y=0,brow='#333',eye='#0a0a0a',blank=false,beard=null}){
  let s='';
  if(beard) s+=`<path d="M${x-34},${y+4} Q${x},${y+62} ${x+34},${y+4} L${x+30},${y+28} Q${x},${y+52} ${x-30},${y+28}Z" fill="${beard}"/>`;
  const e = blank? '#d8dde0':eye;
  s+=`<ellipse cx="${x-14}" cy="${y-6}" rx="5" ry="${blank?4:6}" fill="${e}"/><ellipse cx="${x+14}" cy="${y-6}" rx="5" ry="${blank?4:6}" fill="${e}"/>`;
  s+=`<path d="M${x-24},${y-20} L${x-6},${y-16} M${x+6},${y-16} L${x+24},${y-20}" stroke="${brow}" stroke-width="6" stroke-linecap="round"/>`;
  s+=`<path d="M${x-9},${y+22} L${x+9},${y+22}" stroke="#5a3a2c" stroke-width="4" stroke-linecap="round"/>`;
  return s;
}
// поза: arm = угол руки (градусы) — для анимации
function nikita(o={}){ const a=o.arm??10, b=o.arm2??-8;
  return `<g class="nikita">
  <rect x="-58" y="-190" width="40" height="190" rx="12" fill="#1d2322"/><rect x="18" y="-190" width="40" height="190" rx="12" fill="#1d2322"/>
  <rect x="-66" y="-14" width="56" height="18" rx="8" fill="#0c0d0e"/><rect x="10" y="-14" width="56" height="18" rx="8" fill="#0c0d0e"/>
  <path d="M-80,-400 Q0,-430 80,-400 L92,-170 L-92,-170Z" fill="#33433a"/>
  <path d="M-80,-400 Q-20,-420 0,-416 L0,-170 L-92,-170Z" fill="#2a382f"/>
  <circle cx="0" cy="-360" r="6" fill="#c9a24a"/><circle cx="0" cy="-310" r="6" fill="#c9a24a"/><circle cx="0" cy="-260" r="6" fill="#c9a24a"/>
  <rect x="36" y="-300" width="34" height="62" rx="6" fill="#7fc8e8" opacity=".85"/><rect x="44" y="-312" width="18" height="14" fill="#3b6e88"/>
  <rect x="30" y="-262" width="46" height="34" rx="4" fill="#2a382f"/>
  <g transform="rotate(${a} -78 -392)"><rect x="-100" y="-392" width="34" height="190" rx="16" fill="#2a382f"/><circle cx="-83" cy="-198" r="17" fill="${P.skin}"/></g>
  <g transform="rotate(${b} 78 -392)"><rect x="66" y="-392" width="34" height="190" rx="16" fill="#33433a"/><circle cx="83" cy="-198" r="17" fill="${P.skin}"/></g>
  <rect x="-18" y="-428" width="36" height="30" fill="${P.skinShade}"/>
  <ellipse cx="0" cy="-482" rx="54" ry="62" fill="${P.skin}"/>
  <path d="M-56,-490 Q-50,-560 0,-556 Q50,-560 56,-490 Q40,-530 0,-528 Q-40,-530 -56,-490Z" fill="${P.grey}"/>
  ${face({x:0,y:-482,brow:'#e6e6e6',beard:'#9a9da3'})}
  <path d="M-30,-458 Q-20,-452 -10,-458" stroke="#8a6a55" stroke-width="2" fill="none"/>
  </g>`;}
function stranger(o={}){ const a=o.arm??6, b=o.arm2??-6, blank=o.blank??true;
  return `<g class="stranger">
  <rect x="-56" y="-200" width="42" height="200" rx="12" fill="#262a1e"/><rect x="14" y="-200" width="42" height="200" rx="12" fill="#262a1e"/>
  <rect x="-66" y="-14" width="58" height="20" rx="8" fill="#0b0b0b"/><rect x="8" y="-14" width="58" height="20" rx="8" fill="#0b0b0b"/>
  <path d="M-86,-430 Q0,-456 86,-430 L94,-180 L-94,-180Z" fill="#4a5236"/>
  <path d="M-86,-430 L-94,-180 L-40,-180 L-30,-440Z" fill="#3c4329"/>
  <rect x="-70" y="-330" width="44" height="34" rx="4" fill="#3a4029"/><rect x="26" y="-330" width="44" height="34" rx="4" fill="#3a4029"/>
  <rect x="-80" y="-412" width="30" height="26" rx="3" fill="#2f3421" stroke="#5c6544" stroke-dasharray="4 3"/>
  <path d="M0,-440 L0,-180" stroke="#2f3421" stroke-width="5"/>
  ${o.shard?`<circle cx="22" cy="-300" r="${o.shard}" fill="${P.glow}" opacity=".55" filter="url(#blur8)"/>`:''}
  <g transform="rotate(${a} -84 -420)"><rect x="-106" y="-420" width="36" height="210" rx="16" fill="#3c4329"/><circle cx="-88" cy="-206" r="18" fill="${P.skin}"/></g>
  <g transform="rotate(${b} 84 -420)"><rect x="70" y="-420" width="36" height="210" rx="16" fill="#4a5236"/><circle cx="88" cy="-206" r="18" fill="${P.skin}"/>${o.hold?`<circle cx="88" cy="-196" r="16" fill="${P.glow}"/><circle cx="88" cy="-196" r="40" fill="${P.glow}" opacity=".35" filter="url(#blur8)"/>`:''}</g>
  <rect x="-20" y="-456" width="40" height="34" fill="${P.skinShade}"/>
  <path d="M-52,-520 Q-54,-462 -36,-446 Q0,-424 36,-446 Q54,-462 52,-520 Q50,-576 0,-578 Q-50,-576 -52,-520Z" fill="${P.skin}"/>
  <path d="M-54,-520 Q-52,-590 0,-588 Q52,-590 54,-520 Q46,-560 0,-562 Q-46,-560 -54,-520Z" fill="#14110f"/>
  <path d="M-40,-470 Q0,-430 40,-470 L36,-452 Q0,-424 -36,-452Z" fill="#3a2c24" opacity=".6"/>
  <path d="M36,-548 q8,14 2,26" stroke="#7a1f1a" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${face({x:0,y:-506,brow:'#14110f',blank})}
  </g>`;}
function hunter(o={}){ const c=o.color||'#5a3a2a', a=o.arm??-30;
  return `<g class="hunter">
  <rect x="-52" y="-180" width="40" height="180" rx="12" fill="#1c1c22"/><rect x="12" y="-180" width="40" height="180" rx="12" fill="#1c1c22"/>
  <path d="M-80,-380 Q0,-404 80,-380 L88,-160 L-88,-160Z" fill="${c}"/>
  <g transform="rotate(${a} -76 -372)"><rect x="-98" y="-372" width="32" height="180" rx="15" fill="${c}"/><circle cx="-82" cy="-190" r="16" fill="${P.skin}"/></g>
  <g transform="rotate(${-a} 76 -372)"><rect x="66" y="-372" width="32" height="180" rx="15" fill="${c}"/><circle cx="82" cy="-190" r="16" fill="${P.skin}"/></g>
  <path d="M-62,-430 Q-66,-520 0,-526 Q66,-520 62,-430 Q60,-380 0,-376 Q-60,-380 -62,-430Z" fill="${c}"/>
  <ellipse cx="0" cy="-440" rx="40" ry="46" fill="${P.skin}"/>
  <rect x="-16" y="-500" width="32" height="16" rx="5" fill="#ddd"/><circle cx="0" cy="-492" r="7" fill="#fff8c8"/>
  ${face({x:0,y:-440,brow:'#2a1d18'})}
  <path d="M-12,-414 Q0,-424 12,-414" stroke="#5a3a2c" stroke-width="4" fill="none"/>
  </g>`;}
function soldier(o={}){
  return `<g class="soldier">
  <rect x="-54" y="-190" width="42" height="190" rx="10" fill="#22281c"/><rect x="12" y="-190" width="42" height="190" rx="10" fill="#22281c"/>
  <path d="M-84,-410 Q0,-434 84,-410 L90,-170 L-90,-170Z" fill="#39412b"/>
  <rect x="-70" y="-380" width="140" height="120" rx="10" fill="#2b3121"/>
  <rect x="-130" y="-300" width="240" height="22" rx="6" fill="#111" transform="rotate(-18 0 -290)"/>
  <circle cx="-60" cy="-260" r="17" fill="${P.skin}"/><circle cx="70" cy="-300" r="17" fill="${P.skin}"/>
  <ellipse cx="0" cy="-470" rx="48" ry="54" fill="${P.skin}"/>
  <path d="M-62,-480 Q-62,-560 0,-562 Q62,-560 62,-480 L70,-470 L-70,-470Z" fill="#2f3624"/>
  ${face({x:0,y:-456,brow:'#1a1a1a'})}
  </g>`;}
function buyer(o={}){ const open=o.open||0;
  return `<g class="buyer">
  <path d="M-70,-420 Q0,-444 70,-420 L104,0 L-104,0Z" fill="#0d0f14"/>
  <path d="M0,-430 L-24,-300 L0,-160 L24,-300Z" fill="#7a1d1d"/>
  <path d="M-70,-420 L-104,0 L-60,0 L-20,-420Z" fill="#161a22"/>
  <rect x="-18" y="-446" width="36" height="30" fill="${P.skinShade}"/>
  <ellipse cx="0" cy="-494" rx="46" ry="56" fill="#b48c70"/>
  <path d="M-30,-506 h22 v14 h-22z M8,-506 h22 v14 h-22z" fill="#e8f6ff" opacity=".9"/><path d="M-8,-500 h16" stroke="#222" stroke-width="3"/>
  <path d="M-12,-462 Q4,-456 14,-466" stroke="#3a2620" stroke-width="4" fill="none"/>
  <path d="M-92,-534 L92,-534 L74,-548 Q60,-610 0,-610 Q-60,-610 -74,-548Z" fill="#05060a"/>
  <g transform="translate(110,-150)">
    <rect x="-70" y="0" width="140" height="96" rx="8" fill="#9aa3ad"/><rect x="-22" y="-18" width="44" height="20" rx="6" fill="none" stroke="#6c737b" stroke-width="7"/>
    <rect x="-50" y="40" width="12" height="16" fill="#555"/><rect x="38" y="40" width="12" height="16" fill="#555"/>
  </g></g>`;}
// ---------- Фоны ----------
function defs(){return `<defs>
  <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="blur20"><feGaussianBlur stdDeviation="20"/></filter>
  <filter id="blur40"><feGaussianBlur stdDeviation="40"/></filter>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070e"/><stop offset=".55" stop-color="#1a1220"/><stop offset=".8" stop-color="#5a2416"/><stop offset="1" stop-color="#ff7a2a"/></linearGradient>
  <linearGradient id="skyCold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060c"/><stop offset="1" stop-color="#14202a"/></linearGradient>
  <radialGradient id="glowR"><stop offset="0" stop-color="#6dffd2" stop-opacity=".9"/><stop offset="1" stop-color="#6dffd2" stop-opacity="0"/></radialGradient>
  <radialGradient id="emberR"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></radialGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4fbff" stop-opacity=".75"/><stop offset="1" stop-color="#f4fbff" stop-opacity="0"/></linearGradient>
  <linearGradient id="beamW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0" stop-opacity=".7"/><stop offset="1" stop-color="#fff2b0" stop-opacity="0"/></linearGradient>
</defs>`;}
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647;}}
function pines(y,count,h,color,seed){const r=rnd(seed);let s='';for(let i=0;i<count;i++){const x=i*(1200/count)-60+r()*40,hh=h*(.7+r()*.6);s+=`<path d="M${x},${y-hh} L${x+hh*.28},${y} L${x-hh*.28},${y}Z" fill="${color}"/>`}return s+`<rect x="0" y="${y-2}" width="1080" height="${1920-y}" fill="${color}"/>`;}
function bgVillage(){return `<rect width="1080" height="1920" fill="url(#sky)"/>
  <circle cx="620" cy="1100" r="420" fill="url(#emberR)" opacity=".55"/>
  ${pines(1180,26,260,'#120d10',3)}
  ${[80,330,600,850].map((x,i)=>`<g transform="translate(${x},1380)"><rect x="0" y="0" width="200" height="150" fill="#0b0a0d"/><path d="M-20,0 L100,-90 L220,0Z" fill="#0b0a0d"/><rect x="40" y="40" width="44" height="44" fill="${i%2?'#ffb347':'#2a1d14'}" class="win"/><rect x="120" y="40" width="44" height="44" fill="${i==2?'#ffb347':'#2a1d14'}" class="win"/></g>`).join('')}
  <rect x="0" y="1530" width="1080" height="390" fill="#07060a"/>`;}
function bgCrater(){return `<rect width="1080" height="1920" fill="url(#sky)"/>
  ${pines(1050,22,320,'#0d0b0e',7)}
  <rect x="0" y="1050" width="1080" height="870" fill="#140f0e"/>
  <ellipse cx="540" cy="1430" rx="460" ry="150" fill="#2a1710"/>
  <ellipse cx="540" cy="1440" rx="380" ry="110" fill="#0a0605"/>
  <ellipse cx="540" cy="1450" rx="160" ry="40" fill="url(#emberR)" opacity=".8"/>
  ${[[300,1300],[820,1320],[180,1520],[900,1560],[470,1600]].map(([x,y])=>`<path d="M${x},${y} l40,-160 l14,160Z" fill="#050404" transform="rotate(${(x%7)*8-20} ${x} ${y})"/>`).join('')}`;}
function bgForest(seed=11){const r=rnd(seed);let t='';for(let i=0;i<9;i++){const x=i*130-20+r()*50,w=40+r()*50;t+=`<rect x="${x}" y="0" width="${w}" height="1920" fill="${P.trunk}"/>`}
  return `<rect width="1080" height="1920" fill="#0b1412"/><circle cx="540" cy="700" r="600" fill="url(#emberR)" opacity=".18"/>
  ${(()=>{let s='';for(let i=0;i<14;i++){const x=i*85+r()*30,w=14+r()*16;s+=`<rect x="${x}" y="0" width="${w}" height="1920" fill="#14211d"/>`}return s})()}
  ${t}<rect x="0" y="1560" width="1080" height="360" fill="#080d0b"/>
  ${(()=>{let s='';for(let i=0;i<12;i++){const x=r()*1080,y=1540+r()*60;s+=`<ellipse cx="${x}" cy="${y}" rx="${80+r()*60}" ry="40" fill="#0d1714"/>`}return s})()}`;}
function bgStream(){return `<rect width="1080" height="1920" fill="#0a1110"/>${pines(900,20,400,'#0c1513',5)}
  <rect x="0" y="900" width="1080" height="1020" fill="#101714"/>
  <path d="M-50,1250 Q300,1180 540,1300 T1130,1260 L1130,1520 Q760,1460 540,1560 T-50,1520Z" fill="#2c3a3a"/>
  <path d="M-50,1300 Q300,1240 540,1350 T1130,1310" stroke="#7a8a7a" stroke-width="4" fill="none" opacity=".4"/>
  ${[[300,1350],[640,1420],[820,1330]].map(([x,y])=>`<g transform="translate(${x},${y}) rotate(170)"><ellipse rx="34" ry="12" fill="#c9ccd0"/><path d="M30,0 l22,-14 v28z" fill="#c9ccd0"/><circle cx="-20" cy="-2" r="3" fill="#222"/></g>`).join('')}`;}
function bgCliff(){return `<rect width="1080" height="1920" fill="url(#skyCold)"/>
  <circle cx="200" cy="900" r="500" fill="url(#emberR)" opacity=".25"/>
  ${pines(1000,18,300,'#080c10',9)}
  <path d="M0,1000 L1080,1000 L1080,1920 L0,1920Z" fill="#0d1116"/>
  <path d="M640,1000 L1080,1000 L1080,1920 L760,1920 Q700,1500 640,1000Z" fill="#020305"/>
  <g transform="translate(120,1180)"><rect x="0" y="40" width="300" height="110" rx="20" fill="#0a0c10"/><rect x="40" y="-20" width="190" height="80" rx="14" fill="#0a0c10"/><rect x="60" y="-6" width="70" height="50" fill="#1b2532"/><circle cx="60" cy="150" r="34" fill="#030405"/><circle cx="240" cy="150" r="34" fill="#030405"/><circle cx="292" cy="80" r="16" fill="#fff6d0"/></g>
  <path d="M410,1260 L1080,1000 L1080,1600Z" fill="url(#beamW)" opacity=".35"/>`;}
module.exports={P,defs,nikita,stranger,hunter,soldier,buyer,bgVillage,bgCrater,bgForest,bgStream,bgCliff};
