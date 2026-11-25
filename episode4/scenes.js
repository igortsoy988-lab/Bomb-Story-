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
const B=window.B,C=window.C,D=window.D;const S=[];
const dark=(o)=>`<rect width="1080" height="1920" fill="#000" opacity="${o}"/>`;
const tint=(c,o)=>`<rect width="1080" height="1920" fill="${c}" opacity="${o}"/>`;
const carry=(x,y,s,t)=>place(`${A.stranger({blank:false,arm:165,arm2:-165})}<g transform="translate(280,-640) rotate(-90)">${A.nikita({arm:40,arm2:-40})}</g>`,x,y,s);
const flash=(lt,at)=>lt>at&&lt<at+.12?'<rect width="1080" height="1920" fill="#fff" opacity=".55"/>':'';
// 0 не помнил ничего
S[0]=(lt,d)=>({cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1000},svg:`${C.bgDawn()}${place(A.stranger({blank:false,arm:-30+Math.sin(lt*1.5)*8,arm2:30-Math.sin(lt*1.5)*8}),540,2300,2.4)}`});
// 1 обшарил куртку: пропуск, карта
S[1]=(lt,d)=>{const tp=wt(1,'пропуск')-sceneStart(1),tk=wt(1,'карта')-sceneStart(1),kp=ease((lt-tp+.2)/.5),kk=ease((lt-tk+.2)/.5);
 return {cam:{z:1.0,cx:540,cy:1000},svg:`<rect width="1080" height="1920" fill="#2b3020"/><rect x="0" y="0" width="1080" height="1920" fill="#4a5236"/><path d="M540,0 V1920" stroke="#2f3421" stroke-width="12"/>${C.bgDawn().slice(0,0)}
 ${D.pass(lerp(540,330,kk),lerp(1500,900,kp),1.4*kp+.01)}${kk>0?`<g opacity="${kk}">${D.map(lerp(540,760,kk),lerp(1700,1150,kk),.55,{k:1})}</g>`:''}${hand(lerp(400,600,Math.sin(lt*2)*.5+.5),1300,1.4,-1)}`};};
// 2 точки — одна там, куда звали телефоны
S[2]=(lt,d)=>{const to=wt(2,'одна')-sceneStart(2);return {cam:{z:lerp(1.0,1.2,lt/d),cx:lt>to?660:540,cy:lt>to?1000:960},svg:`<rect width="1080" height="1920" fill="#121510"/>${D.map(540,960,1.3,{k:1,hl:lt>to?(Math.sin(lt*8)>0?1:0):0})}
 ${lt>to+.6&&lt<to+1.4?`<g opacity=".85">${B.phone(860,560,.55,{blink:1})}</g>`:''}`};};
// 3 карта нарисована за неделю до удара — дата
S[3]=(lt,d)=>({cam:{z:lerp(1.4,2.1,ease(lt/d)),cx:800,cy:1480},svg:`<rect width="1080" height="1920" fill="#121510"/>${D.map(540,960,1.3,{k:1})}<ellipse cx="815" cy="1484" rx="${170+10*Math.sin(lt*6)}" ry="50" fill="none" stroke="#ff3030" stroke-width="6"/>`});
// 4 круг и буква Я
S[4]=(lt,d)=>({cam:{z:lerp(1.3,2.6,ease(lt/d)),cx:540,cy:935},svg:`<rect width="1080" height="1920" fill="#121510"/>${D.map(540,960,1.3,{k:1})}`});
// 5 знобило — ночь у осколков
S[5]=(lt,d)=>{const sh=Math.sin(lt*40)*3;let br='';for(let i=0;i<2;i++){const k=(lt*.8+i/2)%1;br+=`<circle cx="${380+k*60}" cy="${1130-k*100}" r="${15+k*30}" fill="#e6eef6" opacity="${.35*(1-k)}" filter="url(#blur8)"/><circle cx="${720+k*60}" cy="${1100-k*100}" r="${15+k*30}" fill="#e6eef6" opacity="${.35*(1-k)}" filter="url(#blur8)"/>`}
 return {cam:{z:1.1,cx:540,cy:1300,x:sh},svg:`${D.bgRoad()}${tint('#203048',.3)}${place(A.nikita({arm:30,arm2:-30}),380,1720,1.1)}${place(A.stranger({blank:false,arm:30,arm2:-30}),720,1700,1.1)}${br}`};};
// 6 больница — старая армейская дорога
S[6]=(lt,d)=>{const sw=Math.sin(lt*5)*14,bob=Math.abs(Math.sin(lt*5))*8,k=lt/d;return {cam:{z:lerp(1.0,1.15,k),cx:540,cy:1300},svg:`${D.bgRoad()}
 ${place(A.stranger({blank:false,arm:sw,arm2:-sw}),lerp(640,580,k),lerp(1700,1500,k)-bob,lerp(.9,.6,k),-1)}${place(A.nikita({arm:-sw,arm2:sw}),lerp(460,500,k),lerp(1780,1560,k)-bob,lerp(1.0,.65,k),-1)}`};};
// 7 у оврага — схватился за голову
S[7]=(lt,d)=>{const th=wt(7,'схватил')-sceneStart(7),k=ease((lt-th)/.4);return {cam:{z:1.05,cx:540,cy:1100,x:k>0&&k<1?Math.sin(lt*60)*6:0},svg:`${D.bgRavineEdge()}${place(A.stranger({blank:false,arm:lerp(6,158,k),arm2:lerp(-6,-158,k)})+(k>.5?'<circle cx="-58" cy="-520" r="20" fill="#c99a7a"/><circle cx="58" cy="-520" r="20" fill="#c99a7a"/>':''),560+(k>0?Math.sin(lt*30)*3:0),1050,1.2)}${place(A.nikita({}),260,1080,1.1)}`};};
// 8 внизу светился мой камень
S[8]=(lt,d)=>({cam:{z:lerp(1.0,1.6,ease(lt/d)),cx:540,cy:1450},svg:`${D.bgRavineEdge()}${C.smallShard(540,1480,1.4,lt,.2)}<circle cx="540" cy="1480" r="${140+20*Math.sin(lt*3)}" fill="url(#glowR)" opacity=".35"/>`});
// 9 «Чемодан… Стекло… Это я их вёз» — воспоминание
S[9]=(lt,d)=>({cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:1100,x:Math.sin(lt*3)*6},svg:`${D.memoryCase(lt,B.fakeShard)}${tint('#6dffd2',.12+.06*Math.sin(lt*9))}${flash(lt,0)}${flash(lt,wt(9,'стекло')-sceneStart(9))}`});
// 10 настоящий осколок забрал себе
S[10]=(lt,d)=>{const tz=wt(10,'настоящий')-sceneStart(10),k=ease((lt-tz)/.8),beat=Math.pow(Math.abs(Math.sin(lt*3.2)),6);
 return {cam:{z:1.0,cx:540,cy:1100},svg:lt<tz-.1?`${D.memoryCase(lt+3,B.fakeShard)}${tint('#6dffd2',.14)}`:`<rect width="1080" height="1920" fill="#06120f"/>${place(A.stranger({shard:20+40*beat,arm2:lerp(-70,-6,k),hold:k<.6}),540,2350,2.4)}${tint('#6dffd2',.12)}${flash(lt,tz)}`};};
// 11 обманул скупщика — его ищут
S[11]=(lt,d)=>{const turn=ease(lt/.7);return {cam:{z:lerp(1.1,1.25,lt/d),cx:560,cy:1250},svg:`${A.bgCliff()}${place(A.buyer(),620,1650,1.3,lerp(1,-1,turn))}<circle cx="600" cy="990" r="${turn*30}" fill="#e8f6ff" opacity="${turn*.4}" filter="url(#blur8)"/>`};};
// 12 сзади хрустнули ветки — люди скупщика
S[12]=(lt,d)=>{const k=ease(lt/1.2);return {cam:{z:1.05,cx:540,cy:1300,x:lt<.2?Math.sin(lt*80)*8:0},svg:`${D.bgRoad()}${tint('#0a1210',.35)}
 ${beamCone(lerp(1100,860,k),1060,40+Math.sin(lt*4)*15,800,200,'beamW',.5)}${beamCone(lerp(1200,1000,k),1080,30+Math.sin(lt*3)*15,800,200,'beamW',.5)}
 ${place(A.hunter({color:'#1b1b1b',arm:-30}),lerp(1150,860,k),1640,.9,-1)}${place(A.hunter({color:'#2a2a2a',arm:-40}),lerp(1260,1000,k),1660,.9,-1)}
 ${place(A.stranger({blank:false}),380,1700,1.0)}${place(A.nikita({}),200,1720,.95)}`};};
// 13 голова не помнила, руки помнили
S[13]=(lt,d)=>{const tr=wt(13,'руки')-sceneStart(13),k=ease((lt-tr)/.4);return {cam:{z:lerp(1.0,1.1,lt/d),cx:540,cy:900},svg:`${D.bgRoad()}${dark(.45)}${place(A.stranger({blank:lt<tr,arm:lerp(6,40,k),arm2:lerp(-6,-40,k)}),540,2500,2.8)}`};};
// 14 три быстрых движения
S[14]=(lt,d)=>{const ws=T.words.filter(w=>w.line===14).map(w=>w.s-sceneStart(14));const hits=[ws[0],ws[1]??ws[0]+.4,ws[2]??ws[0]+.8];const n=hits.filter(h=>lt>h).length;const f=hits.some(h=>lt>h&&lt<h+.1);
 return {cam:{z:1.1+n*.04,cx:540,cy:1300,x:f?Math.sin(lt*90)*16:0,y:f?Math.cos(lt*70)*10:0},svg:`${D.bgRoad()}${tint('#0a1210',.35)}
 ${place(A.stranger({blank:false,arm:n%2?120:-20,arm2:n%2?20:-120}),540,1720,1.1,n%2?-1:1)}
 ${n<2?place(A.hunter({color:'#1b1b1b',arm:-30}),760,1660,.9,-1):`<g transform="translate(760,1700) rotate(-80)">${A.hunter({color:'#1b1b1b',arm:-30}).replace('<g class','<g transform="scale(.9)" class')}</g>`}
 ${n<3?place(A.hunter({color:'#2a2a2a',arm:-40}),900,1680,.9,-1):`<g transform="translate(900,1720) rotate(-80)">${A.hunter({color:'#2a2a2a',arm:-40}).replace('<g class','<g transform="scale(.9)" class')}</g>`}
 ${f?'<rect width="1080" height="1920" fill="#fff" opacity=".35"/>':''}`};};
// 15 подкосились ноги
S[15]=(lt,d)=>{const k=ease(lt/(d*.8));return {cam:{z:1.1,cx:540,cy:1300},svg:`<g transform="rotate(${k*-20} 540 1300)">${D.bgRoad()}${place(A.nikita({arm:20,arm2:-20}),540,lerp(1720,1900,k),1.2)}</g><rect width="1080" height="1920" fill="#000" opacity="${k*.35+.15*Math.abs(Math.sin(lt*2))}"/>`};};
// 16 поднял на плечи — как я отдал ему воду
S[16]=(lt,d)=>{const tv=wt(16,'воду')-sceneStart(16),bob=Math.abs(Math.sin(lt*4))*8,k=lt/d;
 if(lt>tv-.2&&lt<tv+1.2)return {cam:{z:1.1,cx:540,cy:1000},svg:`${A.bgStream()}${tint('#c99a50',.18)}${hand(lerp(330,560,ease((lt-tv+.2)/.6))-170,1180,1.4)}${bottle(lerp(330,560,ease((lt-tv+.2)/.6)),1060,1.6,lt)}`};
 return {cam:{z:lerp(1.0,1.1,k),cx:540,cy:1250},svg:`${D.bgRoad()}${carry(lerp(500,560,k),1760-bob,.85)}`};};
// 17 грузовик на опушке
S[17]=(lt,d)=>({cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1450},svg:`${C.bgDawn()}${D.truck(560,1560,1.1,Math.sin(lt*3)>-.6?1:0)}${carry(170,1760,.45)}`});
// 18 офицер отдаёт честь: «Товарищ майор…»
S[18]=(lt,d)=>{const tt=wt(18,'товарищ')-sceneStart(18),k=ease((lt-tt+.6)/.5);return {cam:{z:lerp(1.0,1.1,lt/d),cx:540,cy:1250},svg:`${C.bgDawn()}${D.truck(300,1500,.8)}
 ${place(D.officer({salute:k}),700,1780,1.25,-1)}${place(A.stranger({blank:false}),300,1790,1.25)}`};};
// 19 «Какое ядро?» — пустые глаза
S[19]=(lt,d)=>{const tb=wt(19,'какое')-sceneStart(19),talk=lt>tb&&lt<d-.4?Math.abs(Math.sin(lt*12)):0;return {cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:1000},svg:`${C.bgDawn()}${place(A.stranger({blank:lt>.6}),540,2500,2.8)}<ellipse cx="540" cy="1146" rx="22" ry="${4+14*talk}" fill="#3a1410"/>`};};
// 20 что значила буква Я
S[20]=(lt,d)=>{const tv=T.lines[20].s-sceneStart(20),kk=clamp(Math.floor((lt-tv-.6)/.45)+1,1,4),tEnd=T.lines[20].e-sceneStart(20)+1.0,tx=clamp((lt-tEnd)/.6);
 return {cam:{z:lerp(2.4,1.9,ease(lt/d)),cx:540,cy:935},svg:`<rect width="1080" height="1920" fill="#121510"/>${D.map(540,960,1.3,{k:kk})}
 ${dark(tx*.85)}<g opacity="${tx}" font-family="Inter" text-anchor="middle" transform="translate(540,935) scale(${1/lerp(2.4,1.9,ease(lt/d))}) translate(-540,-935)"><text x="540" y="900" font-size="64" font-weight="900" fill="#ff9a4a" letter-spacing="4">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="1010" font-size="54" font-weight="700" fill="#6dffd2">Серия 5 — скоро</text></g>`};};

// ---------- субтитры ----------
const KEY={ничего:'#ff5a4a',пропуск:'#c9c2a8',фамилии:'#ff5a4a',карта:'#e4dcc0',точки:'#ff3030',телефоны:'#7ab8ff',неделю:'#ff5a4a',удара:'#ff9a4a',круг:'#ffffff',я:'#ffd24a',знобило:'#9fd8ff',осколков:'#6dffd2',больница:'#ffffff',армейской:'#c9a24a',оврага:'#ff9a4a',голову:'#ff5a4a',камень:'#6dffd2',чемодан:'#6dffd2',стекло:'#6dffd2',вёз:'#ff5a4a',подделки:'#ff5a4a',настоящий:'#6dffd2',обманул:'#ff5a4a',ищут:'#ff5a4a',ветки:'#ff9a4a',руки:'#ffd24a',помнили:'#ffd24a',три:'#ff5a4a',ноги:'#ff5a4a',плечи:'#ffd24a',воду:'#7fc8e8',грузовик:'#c9a24a',майор:'#ffd24a',ядро:'#ff3030',пустыми:'#ff5a4a',буква:'#ffd24a'};
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
 const title=t<3.2?`<g font-family="Inter" text-anchor="middle" opacity="${clamp((3.2-t)/.5)}"><text x="540" y="230" font-size="54" font-weight="900" fill="#ff9a4a" letter-spacing="3">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="300" font-size="40" font-weight="700" fill="#e9e2d0">Серия 4 · «Чужая память»</text></g>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${A.defs()}
 <defs><radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="#000"/><g transform="${cam}">${r.svg}</g>
 ${[7,8,11,12,14].includes(i)?embers(t,25):''}
 <rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="#000" opacity="${(1-cut)*.9+0.04*hash(Math.floor(t*30))}"/>
 ${title}${subs(t)}</svg>`;};
})();
