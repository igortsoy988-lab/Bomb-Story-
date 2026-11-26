// Новая графика серии 5. Стиль — из прошлых серий (их файлы не меняем).
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647;}}
function truckInside(t=0){let trees='';for(let i=0;i<8;i++){const x=((i*170-t*400)%1400+1400)%1400-160;trees+=`<rect x="${x}" y="560" width="${40+i%3*20}" height="520" fill="#0d1612"/>`}
 return `<rect width="1080" height="1920" fill="#1d2218"/><path d="M0,0 L1080,0 L1080,500 Q540,380 0,500Z" fill="#3a4430"/>
 <rect x="140" y="520" width="800" height="560" rx="20" fill="#2a3a46"/><g>${trees}</g><rect x="140" y="520" width="800" height="560" rx="20" fill="none" stroke="#3a4430" stroke-width="30"/>
 ${[...Array(6)].map((_,i)=>`<path d="M${i*216},0 Q${i*216+20},300 ${i*216},520" stroke="#2c3424" stroke-width="10" fill="none"/>`).join('')}
 <rect y="1500" width="1080" height="420" fill="#14170f"/><rect x="0" y="1460" width="1080" height="60" fill="#2b2a20"/>`;}
function pill(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="44" ry="30" fill="#f4f1e8"/><path d="M-30,0 h60" stroke="#c8c2b0" stroke-width="5"/><ellipse cx="-12" cy="-12" rx="14" ry="6" fill="#fff" opacity=".7"/></g>`;}
function satellite(x,y,s=1,t=0,broken=0){const b=broken;return `<g transform="translate(${x},${y}) scale(${s}) rotate(${-20+t*25})">
 <g transform="translate(${-b*80},${-b*30}) rotate(${-b*30})"><rect x="-330" y="-50" width="200" height="100" fill="#20345a"/><path d="M-300,-50 v100 M-260,-50 v100 M-220,-50 v100 M-180,-50 v100 M-330,0 h200" stroke="#4a6aa0" stroke-width="4"/></g>
 <g transform="translate(${b*90},${b*40}) rotate(${b*25})"><rect x="130" y="-50" width="200" height="100" fill="#20345a"/><path d="M160,-50 v100 M200,-50 v100 M240,-50 v100 M280,-50 v100 M130,0 h200" stroke="#4a6aa0" stroke-width="4"/></g>
 <rect x="-110" y="-90" width="220" height="180" rx="16" fill="#b8a46a"/><rect x="-110" y="-90" width="220" height="40" fill="#9a8850"/><circle r="40" fill="#ff7a2a" opacity="${.3+b*.6}"/><circle r="${18+b*6}" fill="#fff3c8" opacity="${.5+b*.5}"/>
 <path d="M110,-30 L170,-140" stroke="#888" stroke-width="6"/><circle cx="170" cy="-140" r="14" fill="#aaa"/>
 <path d="M-110,60 Q-260,200 -420,340" stroke="#ff7a2a" stroke-width="${30+b*30}" opacity=".35" fill="none" stroke-linecap="round"/></g>`;}
function core(x,y,s=1,t=0){const p=.6+.4*Math.sin(t*6);return `<g transform="translate(${x},${y}) scale(${s})"><circle r="${180+20*p}" fill="url(#emberR)" opacity=".9"/><circle r="110" fill="url(#glowR)" opacity="${.4+.3*p}"/>
 <path d="M-60,-10 L-36,-56 L10,-66 L54,-34 L60,14 L26,56 L-30,52Z" fill="#3a1d10"/><path d="M-40,-10 L-24,-40 L8,-46 L38,-24 L40,8 L16,36 L-20,34Z" fill="#ff9a4a"/><circle r="16" fill="#fff6d0" opacity="${p}"/></g>`;}
function laser(x,y,t=0){return `<g transform="translate(${x},${y})"><circle r="${10+3*Math.sin(t*20)}" fill="#ff2020"/><circle r="40" fill="#ff2020" opacity=".25"/></g>`;}
function glassesBroken(x,y,s=1,t=0){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="40" rx="260" ry="50" fill="#1b1e22"/>
 <path d="M-200,-40 h140 v80 h-140z M60,-40 h140 v80 h-140z" fill="#cfe4f0" opacity=".55"/><path d="M-200,-40 h140 v80 h-140z M60,-40 h140 v80 h-140z M-60,-10 Q0,-30 60,-10" fill="none" stroke="#111" stroke-width="10"/>
 <path d="M-190,-30 L-120,10 L-150,38 M-120,10 L-70,-34 M80,-34 L130,0 L190,-36 M130,0 L120,38" stroke="#fff" stroke-width="3" opacity=".9"/>
 <path d="M-200,-30 L-280,-60 M200,-30 L270,10" stroke="#111" stroke-width="8"/><circle cx="${-130+20*Math.sin(t*2)}" cy="-10" r="10" fill="#fff" opacity=".8"/></g>`;}
function ravineBottom(){const r=rnd(8);let gr='';for(let i=0;i<60;i++){const x=r()*1080;gr+=`<path d="M${x},${1500+r()*300} q${8-r()*16},-${60+r()*80} ${16-r()*32},-${100+r()*120}" stroke="#1f2c22" stroke-width="8" fill="none"/>`}
 return `<rect width="1080" height="1920" fill="#050807"/><path d="M0,0 L300,0 Q380,700 420,1300 L0,1500Z" fill="#0b100d"/><path d="M1080,0 L780,0 Q700,700 660,1300 L1080,1500Z" fill="#0b100d"/>
 <rect y="1300" width="1080" height="620" fill="#111813"/>${gr}<ellipse cx="540" cy="1560" rx="150" ry="40" fill="#0a0e0b"/>`;}
module.exports={truckInside,pill,satellite,core,laser,glassesBroken,ravineBottom};
