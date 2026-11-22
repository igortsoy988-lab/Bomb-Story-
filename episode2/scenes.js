// Сцены серии 1. Выполняется в браузере: нужен глобальный A (art.js) и TIMING.
// draw(t) возвращает SVG кадра 1080x1920.
(function(){
const W=1080,H=1920;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;};
const lerp=(a,b,k)=>a+(b-a)*k;
function hash(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
const place=(svg,x,y,s=1,flip=1)=>`<g transform="translate(${x},${y}) scale(${s*flip},${s})">${svg}</g>`;

const T=window.TIMING; // {lines:[{s,e,text}], words:[{w,s,e,line}], end}
// время слова: первое слово строки li, начинающееся с prefix
function wt(li,prefix){const w=T.words.find(w=>w.line===li&&w.w.toLowerCase().replace(/[^а-яё]/g,'').startsWith(prefix));return w?w.s:T.lines[li].s;}
const sceneStart=i=>i===0?0:T.lines[i].s-0.15;
const sceneEnd=i=>i<T.lines.length-1?sceneStart(i+1):T.end;

function shard(x,y,s=1,a=1){return `<g transform="translate(${x},${y}) scale(${s})" opacity="${a}">
 <circle r="70" fill="url(#glowR)" opacity=".8"/>
 <path d="M-26,8 L-10,-30 L18,-24 L30,4 L8,30 L-20,26Z" fill="#2fae8f"/>
 <path d="M-10,-30 L18,-24 L4,0 L-26,8Z" fill="#9dffe4"/><path d="M4,0 L30,4 L8,30Z" fill="#1d7f68"/></g>`;}
function embers(t,n=40,strength=1){let s='';for(let i=0;i<n;i++){const sp=120+hash(i)*220,x=((hash(i+3)*W*1.4)+t*sp*1.6)%(W*1.4)-W*.2,y=H-(((hash(i+7)*H)+t*sp)%(H+100)),r=2+hash(i+9)*4,f=.5+.5*Math.sin(t*6+i);s+=`<circle cx="${x+Math.sin(t*2+i)*30}" cy="${y}" r="${r}" fill="${i%5?'#ff8a3a':'#ffd27a'}" opacity="${(.35+.5*f)*strength}"/>`}return s;}
function beamCone(x,y,ang,len,width,grad='beamW',op=.6){return `<g transform="translate(${x},${y}) rotate(${ang})" opacity="${op}"><path d="M0,0 L${-width/2},${len} L${width/2},${len}Z" fill="url(#${grad})"/></g>`;}
function smoke(t,cx,cy,n=6){let s='';for(let i=0;i<n;i++){const k=((t*.18+i/n)%1);s+=`<circle cx="${cx+Math.sin(i*2+t)*60+(k*120)}" cy="${cy-k*700}" r="${60+k*160}" fill="#2a2228" opacity="${.35*(1-k)}" filter="url(#blur20)"/>`}return s;}
function hand(x,y,s=1,flip=1,skin='#c99a7a',sleeve='#2a382f'){return place(`<rect x="-260" y="-40" width="220" height="110" rx="40" fill="${sleeve}"/><ellipse cx="0" cy="10" rx="90" ry="64" fill="${skin}"/><rect x="40" y="-30" width="90" height="34" rx="17" fill="${skin}"/><rect x="40" y="8" width="96" height="34" rx="17" fill="${skin}"/><rect x="34" y="44" width="84" height="32" rx="16" fill="${skin}"/><rect x="-10" y="-74" width="80" height="34" rx="17" fill="${skin}" transform="rotate(-25 0 -50)"/>`,x,y,s,flip);}
function bottle(x,y,s=1,t=0){const w=Math.sin(t*5)*6;return place(`<rect x="-60" y="-200" width="120" height="330" rx="30" fill="#8fd3f0" opacity=".8"/><path d="M-60,${-60+w} Q0,${-80-w} 60,${-60+w} L60,100 Q60,130 30,130 L-30,130 Q-60,130 -60,100Z" fill="#4aa8d8" opacity=".8"/><rect x="-34" y="-250" width="68" height="56" rx="8" fill="#2d6b8c"/><rect x="-42" y="-160" width="20" height="230" rx="10" fill="#fff" opacity=".35"/>`,x,y,s);}

// ---------- сцены ----------
const B=window.B;const S=[];
const fakeRows=(lt)=>{let s='';for(let r=0;r<5;r++)for(let c=0;c<7;c++)s+=B.fakeShard(170+c*125+(r%2)*60,1250+r*95,.75,.9);return s;};
// 0 В чемодане были не осколки. Стекло и краска
S[0]=(lt,d)=>{const ts=wt(0,'стекло')-sceneStart(0),k=ease((lt-ts+.2)/.7);
 return {cam:{z:lerp(1.15,1.0,ease(lt/d)),cx:540,cy:1000},svg:`<rect width="1080" height="1920" fill="#06080c"/>
 <rect x="80" y="1150" width="920" height="560" rx="30" fill="#9aa3ad"/><rect x="110" y="1180" width="860" height="500" rx="16" fill="#1a2422"/>${fakeRows(lt)}
 <rect width="1080" height="1920" fill="#000" opacity=".35"/>
 ${hand(560,1000,2.0,-1)}${B.fakeShard(470,880,3.2)}
 <g transform="translate(470,880) scale(3.2)" opacity="${k}"><path d="M-22,-6 L18,-20 L22,-10 L-18,4Z" fill="#e8fbff" opacity=".85"/></g>
 <rect x="${lerp(330,560,k)}" y="${lerp(820,770,k)}" width="34" height="90" rx="17" fill="#c99a7a" transform="rotate(-30 ${lerp(330,560,k)} 820)"/>`};};
// 1 прицелы — узнал сразу
S[1]=(lt,d)=>{const tu=wt(1,'узнал')-sceneStart(1);
 if(lt<tu-.1)return {cam:{z:lerp(1.0,1.2,lt/tu),cx:540,cy:960},svg:`<rect width="1080" height="1920" fill="#070a08"/><circle cx="380" cy="960" r="420" fill="url(#glowR)" opacity="${.15+.05*Math.sin(lt*5)}"/>${B.scope(640,960,1.6)}`};
 return {cam:{z:lerp(1.0,1.15,(lt-tu)/(d-tu)),cx:540,cy:760},svg:`<rect width="1080" height="1920" fill="#0b0f0c"/><rect width="1080" height="1920" fill="#6dffd2" opacity=".06"/>${place(A.nikita({}),540,2400,3.6)}`};};
// 2 Скупщик продавал подделки, настоящие — за бесценок
S[2]=(lt,d)=>{const tn=wt(2,'настоящие')-sceneStart(2),k=ease((lt-tn)/1.0),k0=ease(lt/1.2);
 return {cam:{z:lerp(1.25,1.4,lt/d),cx:560,cy:1220},svg:`${A.bgCliff()}${place(A.buyer(),660,1470,.75)}${place(A.hunter({color:'#5a3a2a',arm:-70}),400,1470,.72)}
 ${B.cash(lerp(560,450,k0),1290,.7)}${k>0?B.fakeShard(lerp(470,600,k),1300,.5):''}`};};
// 3 увидел моё лицо, фары развернулись
S[3]=(lt,d)=>{const tf=wt(3,'фары')-sceneStart(3),k=ease((lt-tf)/.5)*(1-.6*clamp((lt-tf-.7)/.8)),turn=ease(lt/.8);
 return {cam:{z:1,cx:540,cy:960,x:k>0?Math.sin(lt*60)*8*(1-k*.5):0},svg:`${A.bgCliff()}<rect width="1080" height="1920" fill="#000" opacity=".4"/>
 ${place(A.buyer(),540,2300,2.6,lerp(1,-1,turn))}
 <circle cx="300" cy="900" r="${k*900}" fill="#fff8e0" opacity="${k*.7}" filter="url(#blur40)"/><circle cx="800" cy="900" r="${k*900}" fill="#fff8e0" opacity="${k*.7}" filter="url(#blur40)"/>`};};
// 4 толкнул в лес, сунул в карман
S[4]=(lt,d)=>{const ts=wt(4,'сунул')-sceneStart(4),x=lerp(860,300,lt/d),bob=Math.abs(Math.sin(lt*9))*18,sw=Math.sin(lt*9)*35,g=lt>ts?1:0;
 return {cam:{z:1.15,cx:540,cy:1250,x:Math.sin(lt*31)*8,y:Math.cos(lt*27)*8},svg:`${A.bgForest(81)}
 ${place(A.nikita({arm:-sw,arm2:sw}),x,1720+bob,1.2,-1)}${place(A.stranger({arm:lt>ts&&lt<ts+.6?-60:sw,arm2:-sw}),x+170,1720+bob,1.2,-1)}
 ${g?`<circle cx="${x-60}" cy="${1720+bob-300}" r="30" fill="url(#glowR)"/>`:''}`};};
// 5 Камень. Светится. Холодный.
S[5]=(lt,d)=>{const th=wt(5,'холодн')-sceneStart(5),k=ease((lt-th)/.6);
 return {cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:960},svg:`${A.bgForest(81)}<rect width="1080" height="1920" fill="#000" opacity=".6"/>
 ${hand(560,1080,2.0,-1)}${B.fakeShard(470,990,2.6)}<rect width="1080" height="1920" fill="#9fd8ff" opacity="${k*.12}"/>
 ${k>0?[...Array(8)].map((_,i)=>`<path d="M${470+Math.cos(i)*120},${990+Math.sin(i)*120} l${Math.cos(i)*40*k},${Math.sin(i)*40*k}" stroke="#dff4ff" stroke-width="4" opacity="${k}"/>`).join(''):''}`};};
// 6 лес стал чужим — камера кружит
S[6]=(lt,d)=>({cam:{z:1.25,cx:540+Math.sin(lt*.6)*60,cy:1300},svg:`<g transform="rotate(${Math.sin(lt*.5)*4} 540 1300)">${B.bgFallen(3)}</g>
 ${place(A.nikita({arm:20,arm2:-20}),520,1640,1.0,Math.sin(lt*1.2)>0?1:-1)}${place(A.stranger({}),720,1600,.95)}${smoke(lt,300,1500,5)}${smoke(lt+3,800,1500,5)}`});
// 7 Поваленные сосны, дым, заблудились
S[7]=(lt,d)=>({cam:{z:lerp(1.3,1.0,ease(lt/d)),cx:540,cy:1350},svg:`${B.bgFallen(5)}${place(A.nikita({}),500,1560,.5)}${place(A.stranger({}),580,1550,.5)}${smoke(lt,200,1600,6)}${smoke(lt+2,900,1600,6)}`});
// 8 компас — стрелка на молчуна
S[8]=(lt,d)=>{const tm=wt(8,'молчун')-sceneStart(8),k=ease((lt-tm+.3)/.6),ang=lerp(Math.sin(lt*7)*25,62,k);
 return {cam:{z:1,cx:540,cy:960},svg:`${B.bgFallen(7)}<rect width="1080" height="1920" fill="#000" opacity=".5"/>${place(A.stranger({}),900,900,.8,-1).replace('<g class','<g opacity=".7" class')}
 ${hand(540,1150,1.6,-1)}${B.compass(500,1000,1.5,ang)}`};};
// 9 зазвонили все телефоны
S[9]=(lt,d)=>{const tz=wt(9,'зазвон')-sceneStart(9);let ph='';for(let i=0;i<16;i++){const on=lt>tz+i*.06;if(!on)continue;const x=60+hash(i)*960,y=900+hash(i+40)*800,v=Math.sin(lt*60+i)*3;ph+=`<g transform="translate(${x+v},${y})"><circle r="70" fill="#7ab8ff" opacity=".25" filter="url(#blur20)"/><rect x="-14" y="-24" width="28" height="48" rx="5" fill="#cfe6ff"/></g>`}
 return {cam:{z:1.05,cx:540,cy:1200,x:lt>tz?Math.sin(lt*50)*3:0},svg:`${A.bgForest(91)}<rect width="1080" height="1920" fill="#000" opacity=".45"/>${ph}`};};
// 10 Новая точка падения рядом
S[10]=(lt,d)=>({cam:{z:lerp(1.0,1.1,lt/d),cx:540,cy:960,x:Math.sin(lt*55)*2},svg:`<rect width="1080" height="1920" fill="#050709"/>${hand(560,1260,1.8,-1)}${B.phone(540,880,1.65,{blink:Math.sin(lt*8)>0?1:0})}`});
// 11 второго удара не было
S[11]=(lt,d)=>{let st='';for(let i=0;i<60;i++)st+=`<circle cx="${hash(i)*1080}" cy="${hash(i+9)*1100}" r="${1+hash(i+3)*2.5}" fill="#fff" opacity="${.3+.5*Math.abs(Math.sin(lt*2+i))}"/>`;
 return {cam:{z:1.0,cx:540,cy:lerp(1000,900,lt/d)},svg:`<rect width="1080" height="1920" fill="url(#skyCold)"/>${st}<circle cx="850" cy="1350" r="300" fill="url(#emberR)" opacity=".18"/>
 <path d="M0,1400 ${[...Array(28)].map((_,i)=>`L${i*40},${1300-hash(i)*180} L${i*40+20},1400`).join(' ')} L1080,1400 L1080,1920 L0,1920Z" fill="#05080b"/>`};};
// 12 толпу ведут к нам — вид сверху
S[12]=(lt,d)=>{let dots='';for(let i=0;i<26;i++){const a=hash(i)*Math.PI*2,r0=900+hash(i+5)*300,k=clamp(lt/d*1.0+hash(i+8)*.1),r=lerp(r0,170,k);dots+=`<circle cx="${540+Math.cos(a)*r}" cy="${1000+Math.sin(a)*r}" r="9" fill="#fff6c8"/><circle cx="${540+Math.cos(a)*r}" cy="${1000+Math.sin(a)*r}" r="40" fill="#fff6c8" opacity=".2"/>`}
 let tr='';for(let i=0;i<40;i++)tr+=`<circle cx="${hash(i+70)*1080}" cy="${hash(i+90)*1920}" r="${40+hash(i)*50}" fill="#0c1714"/>`;
 return {cam:{z:lerp(1.0,1.3,lt/d),cx:540,cy:1000},svg:`<rect width="1080" height="1920" fill="#101c18"/>${tr}${dots}<circle cx="525" cy="1000" r="14" fill="#33433a" stroke="#c9a24a" stroke-width="3"/><circle cx="560" cy="1000" r="14" fill="#4a5236"/><circle cx="540" cy="1000" r="${110+20*Math.sin(lt*5)}" fill="none" stroke="#ff3030" stroke-width="4" opacity=".6"/>`};};
// 13 разбил камень — красный огонёк
S[13]=(lt,d)=>{const tr=wt(13,'разбил')-sceneStart(13)+.2,hit=lt>tr,bl=Math.sin(lt*10)>0?1:0,k=ease((lt-tr+.4)/.4);
 return {cam:{z:1.1,cx:540,cy:1100,x:hit&&lt<tr+.15?Math.sin(lt*90)*14:0},svg:`<rect width="1080" height="1920" fill="#080d0b"/><path d="M-50,1300 Q300,1180 600,1260 T1130,1220 L1130,1420 Q600,1460 -50,1400Z" fill="#2a1d14"/>
 ${hit?B.brokenFake(540,1250,3.2,lt>tr+.6?bl:0):`${hand(560,lerp(800,1150,k)+120,1.8,-1)}${B.fakeShard(470,lerp(800,1150,k),2.4)}`}
 ${hit&&lt<tr+.12?'<rect width="1080" height="1920" fill="#fff" opacity=".6"/>':''}`};};
// 14 Приманка — лицо в красном мигании
S[14]=(lt,d)=>{const bl=Math.sin(lt*10)>0;return {cam:{z:lerp(1.0,1.2,lt/d),cx:540,cy:760},svg:`<rect width="1080" height="1920" fill="#0b0b0b"/>${place(A.nikita({}),540,2400,3.6)}<rect width="1080" height="1920" fill="#ff1a1a" opacity="${bl?.22:.04}"/>`};};
// 15 Настоящий осколок бился, как сердце
S[15]=(lt,d)=>{const tn=wt(15,'настоящий')-sceneStart(15),k=ease((lt-tn)/.8),beat=Math.pow(Math.abs(Math.sin(lt*3.2)),6);
 return {cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1100},svg:`${A.bgForest(101)}<rect width="1080" height="1920" fill="#000" opacity=".4"/>
 ${place(A.stranger({shard:40+40*beat,blank:true}),540,2350,2.4)}${k>0?B.realShard(560,1640,1.8*k,beat):''}`};};
// 16 бутылка по ручью — фонари ушли за ней
S[16]=(lt,d)=>{const tf=wt(16,'фонари')-sceneStart(16),bx=lerp(240,980,clamp(lt/d)),by=1370+Math.sin(lt*2)*10,bl=Math.sin(lt*10)>0;
 const beams=lt>tf?[200,540,880].map((x,i)=>beamCone(x,700,Math.atan2(bx-x,by-700)*-57.3,900,180,'beamW',.45)).join(''):'';
 return {cam:{z:1.1,cx:540,cy:1300},svg:`${A.bgStream()}${beams}<g transform="translate(${bx},${by}) rotate(80) scale(.35)">${bottle(0,0,1,lt).replace(/^/,'')}</g>${bl?`<circle cx="${bx}" cy="${by}" r="16" fill="#ff2a2a"/><circle cx="${bx}" cy="${by}" r="50" fill="#ff2a2a" opacity=".3"/>`:''}`};};
// 17 Молчун повёл меня сам
S[17]=(lt,d)=>{const off=(lt*80)%130,sw=Math.sin(lt*5)*14,bob=Math.abs(Math.sin(lt*5))*10;
 return {cam:{z:1.1,cx:540,cy:1300},svg:`<g transform="translate(${-off},0)">${A.bgForest(111)}</g><g transform="translate(${1080-off},0)">${A.bgForest(111)}</g>
 ${place(A.stranger({arm:sw,arm2:-sw,shard:30}),680,1700-bob,1.2)}${place(A.nikita({arm:-sw,arm2:sw}),380,1720-bob,1.1)}`};};
// 18 палатка, сотни настоящих осколков
S[18]=(lt,d)=>({cam:{z:lerp(1.0,1.6,ease(lt/d)),cx:540,cy:1450},svg:`${B.bgTent()}${B.tent(540,1600,1.3,lt)}`});
// 19 никого, чайник горячий
S[19]=(lt,d)=>({cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:1100},svg:`${B.bgTent()}<rect width="1080" height="1920" fill="#000" opacity=".55"/>${B.kettle(500,1250,2.4,lt)}`});
// 20 хозяин рядом и видит нас
S[20]=(lt,d)=>{const tv=wt(20,'видит')-sceneStart(20),g=lt>tv&&lt<tv+1.0?Math.sin((lt-tv)*Math.PI):0,tEnd=T.lines[20].e-sceneStart(20)+1.0,tx=clamp((lt-tEnd)/.6);
 return {cam:{z:lerp(1.3,1.0,ease(lt/3)),cx:540,cy:1400},svg:`${B.bgTent()}${B.tent(380,1650,.7,lt)}${B.kettle(800,1700,.8,lt)}
 <g opacity="${g}"><rect x="830" y="1080" width="26" height="12" fill="#e8f6ff"/><rect x="866" y="1080" width="26" height="12" fill="#e8f6ff"/><circle cx="860" cy="1086" r="50" fill="#e8f6ff" opacity=".25" filter="url(#blur8)"/></g>
 <rect width="1080" height="1920" fill="#000" opacity="${tx*.8}"/>
 <g opacity="${tx}" font-family="Inter" text-anchor="middle"><text x="540" y="900" font-size="64" font-weight="900" fill="#ff9a4a" letter-spacing="4">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="1010" font-size="54" font-weight="700" fill="#6dffd2">Серия 3 — скоро</text></g>`};};

// ---------- субтитры ----------
const KEY={осколки:'#ff9a4a',стекло:'#6dffd2',краска:'#6dffd2',прицелы:'#6dffd2',подделки:'#ff5a4a',настоящие:'#ffd24a',фары:'#ffffff',карман:'#ffd24a',холодный:'#9fd8ff',чужим:'#ff5a4a',заблудились:'#ff5a4a',компас:'#ffd24a',молчуна:'#ff5a4a',телефоны:'#7ab8ff',новая:'#ff5a4a',падения:'#ff5a4a',следили:'#ff5a4a',красный:'#ff3030',огонёк:'#ff3030',приманка:'#ff3030',подделка:'#ff3030',настоящий:'#6dffd2',сердце:'#6dffd2',бутылку:'#7fc8e8',палатка:'#ff9a4a',осколков:'#6dffd2',никого:'#ff5a4a',горячий:'#ff9a4a',видит:'#ff5a4a',стекляшку:'#6dffd2',ловят:'#ff3030'};
function chunks(line){const ws=T.words.filter(w=>w.line===line);const out=[];let cur=[];for(const w of ws){cur.push(w);const brk=/[.,!?…:—]$/.test(w.w)||cur.length>=3||cur.map(x=>x.w).join(' ').length>16;if(brk){out.push(cur);cur=[]}}if(cur.length)out.push(cur);return out;}
const CH=T.lines.map((_,i)=>chunks(i));
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function subs(t){let li=T.lines.findIndex(l=>t>=l.s-0.05&&t<=l.e+0.35);if(li<0)return '';
 const ch=CH[li].find(c=>t>=c[0].s-0.05&&t<=c[c.length-1].e+0.3)||CH[li].filter(c=>c[0].s<=t).pop();if(!ch)return '';
 const fs=Math.min(86,Math.floor(1700/Math.max(1,ch.map(w=>w.w).join(' ').length)));let words=ch.map(w=>{const bare=w.w.toLowerCase().replace(/[^а-яё]/g,'');const on=t>=w.s;const col=KEY[bare]||(on?'#ffffff':'#8a8f99');const pop=t>=w.s&&t<w.s+.15?1.12:1;return {w:w.w.replace(/[«»]/g,''),col:on?col:'#8a8f99',on,pop,key:!!KEY[bare]};});
 const txt=words.map(o=>`<tspan fill="${o.col}" ${o.key&&o.on?'font-weight="900"':''}>${esc(o.w)}</tspan>`).join(' ');
 return `<g font-family="Inter" font-weight="800" font-size="${fs}" text-anchor="middle"><text x="540" y="1440" stroke="#000" stroke-width="16" stroke-linejoin="round" fill="#000" opacity=".85">${esc(words.map(o=>o.w).join(' '))}</text><text x="540" y="1440">${txt}</text></g>`;}

window.draw=function(t){let i=0;while(i<S.length-1&&t>=sceneEnd(i))i++;const st=sceneStart(i),d=sceneEnd(i)-st,lt=t-st;
 const r=S[i](lt,d,t),c=Object.assign({z:1,cx:540,cy:960,x:0,y:0},r.cam);
 const cam=`translate(${540+c.x},${960+c.y}) scale(${c.z}) translate(${-c.cx},${-c.cy})`;
 const fadeIn=clamp(lt/.18),cut=i>0?fadeIn:clamp(t/.4);
 const title=t<3.2?`<g font-family="Inter" text-anchor="middle" opacity="${clamp((3.2-t)/.5)}"><text x="540" y="230" font-size="54" font-weight="900" fill="#ff9a4a" letter-spacing="3">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="300" font-size="40" font-weight="700" fill="#e9e2d0">Серия 2 · «Падение метеорита»</text></g>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${A.defs()}
 <defs><radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="#000"/><g transform="${cam}">${r.svg}</g>
 ${[0,1,10,12,13,14,19].includes(i)?'':embers(t,i===20?50:30)}
 <rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="#000" opacity="${(1-cut)*.9+0.04*hash(Math.floor(t*30))}"/>
 ${title}${subs(t)}</svg>`;};
})();
