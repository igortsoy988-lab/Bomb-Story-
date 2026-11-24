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
const B=window.B,C=window.C;const S=[];
const dark=(o)=>`<rect width="1080" height="1920" fill="#000" opacity="${o}"/>`;
const blueTint=(o)=>`<rect width="1080" height="1920" fill="#1a2a4a" opacity="${o}"/>`;
const sleeper=(x,y,s,o={})=>`<g transform="translate(${x},${y}) rotate(-90) scale(${s})">${A.stranger(o)}</g>`;
// 0 очки блеснули, скупщик ушёл
S[0]=(lt,d)=>{const tb=wt(0,'блеснул')-sceneStart(0),g=lt>tb&&lt<tb+.8?Math.sin((lt-tb)/.8*Math.PI):0,k=ease((lt-tb-.6)/(d-tb-.6));
 return {cam:{z:1.05,cx:540,cy:1400},svg:`${B.bgTent()}${B.tent(380,1650,.8,lt)}
 <g opacity="${(1-k)*.9}">${place(A.buyer(),lerp(840,1150,k),1560,.6)}</g>${dark(.25)}
 <g opacity="${g}"><rect x="824" y="1222" width="20" height="10" fill="#e8f6ff"/><rect x="852" y="1222" width="20" height="10" fill="#e8f6ff"/><circle cx="848" cy="1227" r="60" fill="#e8f6ff" opacity=".3" filter="url(#blur8)"/></g>`};};
// 1 стерёг издалека, у палатки никто не спал
S[1]=(lt,d)=>({cam:{z:lerp(1.5,1.0,ease(lt/d)),cx:540,cy:1550},svg:`${B.bgTent()}${B.tent(540,1600,1.0,lt)}${B.kettle(860,1700,.6,lt)}`});
// 2 ночёвка за ручьём
S[2]=(lt,d)=>{const sw=Math.sin(lt*2)*20;return {cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:1450},svg:`${A.bgStream()}${dark(.5)}${C.campfire(900,1690,.9,lt)}${sleeper(740,1700,.9,{shard:30})}${place(A.nikita({arm:-40+sw}),190,1700,.95)}`};};
// 3 куртка у груди, красное пятно
S[3]=(lt,d)=>{const tp=wt(3,'красное')-sceneStart(3),k=ease((lt-tp)/.6),beat=Math.pow(Math.abs(Math.sin(lt*3.2)),6);
 return {cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1050},svg:`<rect width="1080" height="1920" fill="#06080a"/><g transform="translate(540,1050) scale(1.6)"><rect x="-300" y="-260" width="600" height="560" fill="#c99a7a"/><path d="M-300,-260 L-120,-260 L-60,300 L-300,300Z" fill="#4a5236"/><path d="M300,-260 L120,-260 L60,300 L300,300Z" fill="#3c4329"/></g>
 <ellipse cx="${560+60}" cy="1130" rx="${80*k}" ry="${60*k}" fill="#c4452c" opacity="${.75*k}"/>${B.realShard(470,1040,1.4,beat)}<circle cx="540" cy="1050" r="600" fill="#ff7a2a" opacity=".08"/>`};};
// 4 шорох, тень с щипцами
S[4]=(lt,d)=>{const tt=wt(4,'тень')-sceneStart(4),k=ease((lt-tt+.3)/1.2);
 return {cam:{z:1.05,cx:540,cy:1450},svg:`${A.bgForest(121)}${dark(.55)}${C.campfire(250,1720,.8,lt,.2)}${sleeper(640,1740,.85,{shard:26})}${C.shadowThief(lerp(1150,760,k),1760,1.3,k)}`};};
// 5 щипцы вынули камень
S[5]=(lt,d)=>{const k=ease(lt/(d*.6)),beat=Math.pow(Math.abs(Math.sin(lt*3.2)),6);
 return {cam:{z:1.0,cx:540,cy:960},svg:`${A.bgForest(121)}${dark(.7)}${sleeper(820,1750,1.1,{})}
 ${C.tongsShard(480,lerp(1500,900,k),1.2)}${B.realShard(480,lerp(1500,900,k)+10,1.3,beat)}`};};
// 6 под утро — пустая куртка, ушёл в лес
S[6]=(lt,d)=>{const tu=wt(6,'ушёл')-sceneStart(6),k=ease((lt-tu+.2)/(d-tu)),sw=Math.sin(lt*6)*14;
 return {cam:{z:1.05,cx:540,cy:1400},svg:`${A.bgForest(131)}${blueTint(.35)}${dark(.2)}
 ${place(A.stranger({arm2:lt<tu?-50:sw,arm:-sw}),lerp(540,820,k),lerp(1720,1450,k),lerp(1.2,.5,k))}`};};
// 7 не успел, шестьдесят девять
S[7]=(lt,d)=>{let br='';for(let i=0;i<3;i++){const k=((lt*.7+i/3)%1);br+=`<circle cx="${430+k*80}" cy="${880-k*120}" r="${20+k*40}" fill="#dfe6ee" opacity="${.35*(1-k)}" filter="url(#blur8)"/>`}
 return {cam:{z:1.15,cx:520,cy:1200,y:Math.sin(lt*2.2)*6},svg:`${A.bgForest(131)}${blueTint(.35)}<rect x="680" y="0" width="120" height="1920" fill="#0a120f"/>${place(A.nikita({arm2:-120,arm:20}),520,1720,1.3)}${br}`};};
// 8 с неба упал осколок
S[8]=(lt,d)=>{const tf=wt(8,'упал')-sceneStart(8),k=clamp((lt-.2)/(tf+.3)),hit=lt>tf+.3;let dirt='';if(hit){const q=lt-tf-.3;for(let i=0;i<14;i++)dirt+=`<circle cx="${560+Math.cos(i)*q*400*hash(i)}" cy="${1500-Math.abs(Math.sin(i*1.7))*q*500+q*q*900}" r="${6+hash(i+3)*10}" fill="#2a1d14"/>`}
 return {cam:{z:1.0,cx:540,cy:1000,x:hit&&lt<tf+.6?Math.sin(lt*70)*12:0},svg:`${C.bgDawn()}${dark(.45)}
 ${hit?'':C.fallingShard(lerp(200,560,k),lerp(200,1500,k),1)}${dirt}${hit&&lt<tf+.45?'<rect width="1080" height="1920" fill="#fff3c8" opacity=".55"/>':''}${hit?C.smallShard(560,1500,1.4,lt,1):''}`};};
// 9 шипел в росе, тёплый
S[9]=(lt,d)=>({cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1100},svg:`<rect width="1080" height="1920" fill="#0d1512"/>${[...Array(30)].map((_,i)=>`<path d="M${hash(i)*1080},1400 q${10-hash(i+1)*20},-${120+hash(i+2)*160} ${20-hash(i+3)*40},-${200+hash(i+4)*200}" stroke="#1d3a2a" stroke-width="10" fill="none"/>`).join('')}${C.smallShard(540,1150,4,lt,1)}`});
// 10 телефон — белые искры
S[10]=(lt,d)=>{const tb=wt(10,'белыми')-sceneStart(10);return {cam:{z:lerp(1.0,1.08,lt/d),cx:540,cy:960},svg:`<rect width="1080" height="1920" fill="#050709"/>${hand(560,1260,1.8,-1)}${C.phoneSparks(540,880,1.65,lt,lt>tb-.6?90:6)}`};};
// 11 скупщик: три тысячи
S[11]=(lt,d)=>{const k=ease(lt/1.4);return {cam:{z:lerp(1.0,1.1,lt/d),cx:540,cy:1300},svg:`${A.bgForest(141)}${blueTint(.25)}${place(A.hunter({color:'#15181c',arm:-20}),860,1560,.6)}${place(A.hunter({color:'#15181c',arm:-20}),980,1580,.6)}
 ${place(A.buyer(),lerp(1200,700,k),1700,1.1,-1)}${place(A.nikita({}),260,1720,1.1)}${lt>wt(11,'три')-sceneStart(11)?C.bills(520,1330,.7,lt):''}`};};
// 12 квартира → ужин
S[12]=(lt,d)=>{const tu=wt(12,'сегодня')-sceneStart(12);return {cam:{z:lerp(1.1,1.0,lt/d),cx:540,cy:1000},svg:`<rect width="1080" height="1920" fill="#0a0d10"/>
 ${lt<tu?`<g opacity=".9"><rect x="290" y="700" width="500" height="420" fill="#1a2230"/><path d="M250,700 L540,480 L830,700Z" fill="#1a2230"/>${[0,1,2].map(i=>`<rect x="${340+i*150}" y="780" width="90" height="90" fill="#ffb347"/>`).join('')}</g>`:C.bills(540,1000,1.8+.05*Math.sin(lt*5),lt)}`};};
// 13 перчатки, щипцы, свинцовый ящик
S[13]=(lt,d)=>{const tp=wt(13,'перчатки')-sceneStart(13),tq=wt(13,'щипцы')-sceneStart(13),ty=wt(13,'свинцовый')-sceneStart(13);
 return {cam:{z:1.0,cx:540,cy:1000},svg:`${A.bgForest(141)}${dark(.5)}${place(A.buyer(),560,2300,2.3,-1)}
 ${lt>tp?C.gloves(220,lerp(1500,1150,ease((lt-tp)/.5)),1.4):''}${lt>tq?`<g transform="translate(560,${lerp(1400,1000,ease((lt-tq)/.5))}) rotate(25)">${C.tongsShard(0,0,1.2)}</g>`:''}${lt>ty?C.leadBox(830,lerp(1500,1200,ease((lt-ty)/.5)),.9,.8):''}`};};
// 14 дозиметр трещал
S[14]=(lt,d)=>{const n=clamp(lt/d*1.3)*.85+Math.sin(lt*40)*.04;return {cam:{z:1.0,cx:540,cy:1000,x:Math.sin(lt*45)*2},svg:`<rect width="1080" height="1920" fill="#15181c"/><rect y="1200" width="1080" height="120" fill="#2a1d14"/>${C.dosimeter(540,1000,2.2,n)}`};};
// 15 понял — радиоактивны
S[15]=(lt,d)=>{const tr=wt(15,'радиоакт')-sceneStart(15),k=ease((lt-tr)/.8);return {cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:760},svg:`<rect width="1080" height="1920" fill="#0b0b0b"/>${place(A.nikita({}),540,2400,3.6)}
 <g opacity="${k*.55}">${C.radSign(540,820,2.6+.1*Math.sin(lt*4))}</g><rect width="1080" height="1920" fill="#f2c230" opacity="${k*.08}"/>`};};
// 16 поэтому ×3 — вспышки-воспоминания
S[16]=(lt,d)=>{const ws=T.words.filter(w=>w.line===16&&w.w.toLowerCase().startsWith('поэтому')).map(w=>w.s-sceneStart(16));let j=0;while(j<ws.length-1&&lt>=ws[j+1]-.1)j++;
 const f=lt-ws[j]<.12;const scenes=[`${B.bgTent()}${B.tent(540,1600,1.3,lt)}`,`${A.bgStream()}`,`${A.bgCliff()}${place(A.buyer(),620,1470,.75)}${[0,1,2,3].map(i=>place(A.hunter({color:'#15181c',arm:-20}),300-i*70,1450,.45)).join('')}`];
 return {cam:{z:lerp(1.05,1.15,(lt-ws[j])/2),cx:540,cy:1350},svg:`${scenes[j]}<rect width="1080" height="1920" fill="#0d3a30" opacity=".35"/>${f?'<rect width="1080" height="1920" fill="#fff" opacity=".6"/>':''}`};};
// 17 отшвырнул в овраг
S[17]=(lt,d)=>{const tk=wt(17,'отшвырнул')-sceneStart(17)+.2,k=ease((lt-tk)/1.2);return {cam:{z:1.05,cx:540,cy:1300},svg:`${C.bgDawn()}${dark(.4)}<path d="M600,1920 L620,1500 Q700,1450 1080,1460 L1080,1920Z" fill="#020304"/>
 ${place(A.nikita({arm:10,arm2:-10}),360,1700,1.1)}<rect x="${lerp(420,370,ease((lt-tk+.3)/.3))}" y="1660" width="80" height="40" rx="18" fill="#0c0d0e"/>
 <g opacity="${1-ease((lt-tk-.6)/.8)}" transform="rotate(${k*720} ${lerp(520,860,k)} ${lerp(1690,1820,k)})">${C.smallShard(lerp(520,860,k),lerp(1690,1820,k),1,lt,.3)}</g>`};};
// 18 молчун вышел из леса на рассвете
S[18]=(lt,d)=>{const k=ease(lt/d),sw=Math.sin(lt*5)*12;return {cam:{z:1.0,cx:540,cy:1100},svg:`${C.bgDawn()}${place(A.stranger({blank:false,arm:sw,arm2:-sw}),540,lerp(1350,1900,k),lerp(.45,1.6,k))}
 ${[...Array(4)].map((_,i)=>`<ellipse cx="${(i*330+lt*40)%1400-150}" cy="${1500+i*70}" rx="420" ry="90" fill="#c8ccd8" opacity=".2" filter="url(#blur40)"/>`).join('')}`};};
// 19 впервые заговорил
S[19]=(lt,d)=>{const ts=wt(19,'отец')-sceneStart(19);const talk=lt>ts&&lt<d-.3?Math.abs(Math.sin(lt*12)):0;
 return {cam:{z:lerp(1.0,1.1,lt/d),cx:540,cy:1000},svg:`${C.bgDawn()}${place(A.stranger({blank:false}),540,2500,2.8)}<ellipse cx="540" cy="1146" rx="${22}" ry="${4+14*talk}" fill="#3a1410"/>`};};
// 20 не помнил; ожог в форме осколка
S[20]=(lt,d)=>{const k=ease(lt/3),tEnd=T.lines[20].e-sceneStart(20)+1.0,tx=clamp((lt-tEnd)/.6),glow=.6+.4*Math.sin(lt*3);
 return {cam:{z:1.0,cx:540,cy:960,y:lerp(500,0,k)},svg:`<g transform="translate(0,-500)">${C.bgDawn()}${place(A.stranger({blank:false}),540,2500,2.8)}</g>${C.burnChest(540,1250,1.5,glow)}
 ${dark(tx*.8)}<g opacity="${tx}" font-family="Inter" text-anchor="middle"><text x="540" y="900" font-size="64" font-weight="900" fill="#ff9a4a" letter-spacing="4">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="1010" font-size="54" font-weight="700" fill="#6dffd2">Серия 4 — скоро</text></g>`};};

// ---------- субтитры ----------
const KEY={очки:'#e8f6ff',скупщик:'#ffd24a',никто:'#ff5a4a',ожог:'#ff5a4a',красное:'#ff5a4a',тень:'#ff5a4a',щипцами:'#c0c8d0',щипцы:'#c0c8d0',камень:'#6dffd2',осколок:'#ff9a4a',тёплый:'#ff9a4a',искрами:'#ffffff',телефон:'#7ab8ff',тысячи:'#6a8fbf',квартира:'#ff9a4a',ужин:'#ff5a4a',перчатки:'#f2c230',свинцовый:'#c0c8d0',ящик:'#c0c8d0',дозиметр:'#f2c230',радиоактивны:'#f2c230',знали:'#ff5a4a',поэтому:'#f2c230',рыба:'#c9ccd0',овраг:'#ff9a4a',впервые:'#6dffd2',заговорил:'#6dffd2',число:'#ffd24a',помнил:'#ff5a4a',осколка:'#ff5a4a',шестьдесят:'#ffd24a',девять:'#ffd24a',руками:'#ff5a4a',вором:'#ff5a4a'};
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
 const title=t<3.2?`<g font-family="Inter" text-anchor="middle" opacity="${clamp((3.2-t)/.5)}"><text x="540" y="230" font-size="54" font-weight="900" fill="#ff9a4a" letter-spacing="3">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="300" font-size="40" font-weight="700" fill="#e9e2d0">Серия 3 · «Доза»</text></g>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${A.defs()}
 <defs><radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="#000"/><g transform="${cam}">${r.svg}</g>
 ${[0,1,2,4,11,16].includes(i)?embers(t,30):''}
 <rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="#000" opacity="${(1-cut)*.9+0.04*hash(Math.floor(t*30))}"/>
 ${title}${subs(t)}</svg>`;};
})();
