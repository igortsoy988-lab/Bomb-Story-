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
const B=window.B,C=window.C,D=window.D,E=window.E,F=window.F;const S=[];
const dark=(o)=>`<rect width="1080" height="1920" fill="#000" opacity="${o}"/>`;
const tint=(c,o)=>`<rect width="1080" height="1920" fill="${c}" opacity="${o}"/>`;
const flash=(lt,at,o=.55,c='#fff')=>lt>at&&lt<at+.12?`<rect width="1080" height="1920" fill="${c}" opacity="${o}"/>`:'';
// 0 кровь на очках — светится ладонь
S[0]=(lt,d)=>{const tl=wt(0,'ладонь')-sceneStart(0);return lt<tl-.15?{cam:{z:lerp(1.35,1.15,lt/tl),cx:540,cy:1100},svg:`${E.ravineBottom()}${beamCone(540,500,0,1000,420,'beamW',.45)}${F.bloodGlasses(540,1150,1.7,lt,E.glassesBroken)}`}
 :{cam:{z:lerp(1.25,1.05,(lt-tl)/(d-tl)),cx:540,cy:1000,x:Math.sin(lt*25)*2},svg:`<rect width="1080" height="1920" fill="#05080a"/>${F.palm(540,1100,1.6,lt,0)}${flash(lt,tl-.15,.5,'#6dffd2')}`};};
// 1 ожог полз по коже
S[1]=(lt,d)=>{const tt=wt(1,'ожог')-sceneStart(1);return {cam:{z:lerp(1.1,1.5,ease(lt/d)),cx:560,cy:1000},svg:`<rect width="1080" height="1920" fill="#05080a"/>${F.palm(540,1100,1.6,lt,clamp((lt-tt+.2)/(d-tt)))}`};};
// 2 зазвонил телефон — номер скрыт
S[2]=(lt,d)=>({cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:960},svg:`<rect width="1080" height="1920" fill="#06080c"/>${F.phoneCall(540,960,1.6,lt)}${flash(lt,0,.4)}`});
// 3 «Ядро у меня…» — скупщик в дыму
S[3]=(lt,d)=>{const tr=wt(3,'рассвета')-sceneStart(3);return {cam:{z:lerp(1.1,1.3,lt/d),cx:540,cy:1050},svg:`<rect width="1080" height="1920" fill="#0b0a0c"/>${smoke(lt,300,1700,6)}${smoke(lt+2,800,1700,6)}
 <g opacity=".95">${place(A.buyer(),540,2300,2.4).replace(/#b48c70/g,'#5a463a')}</g><rect x="640" y="1020" width="60" height="110" rx="10" fill="#101216"/>${smoke(lt+4,540,1900,5)}${tint('#ff3030',lt>tr?.1+.05*Math.sin(lt*10):0)}`};};
// 4 офицер: майора не отдадим
S[4]=(lt,d)=>{const tn=wt(4,'майора')-sceneStart(4);return {cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:900,x:lt>tn&&lt<tn+.15?Math.sin(lt*80)*8:0},svg:`${E.truckInside(lt)}${place(D.officer({}),540,2400,2.6)}`};};
// 5 ночью майор разбудил — палец к губам
S[5]=(lt,d)=>{const tp=wt(5,'палец')-sceneStart(5),k=ease((lt-tp+.3)/.5);return {cam:{z:lerp(1.05,1.2,lt/d),cx:540,cy:1000},svg:`<rect width="1080" height="1920" fill="#04060a"/>${place(A.stranger({blank:false}),540,2500,2.8)}
 ${k>0?`<g transform="translate(0,${lerp(300,0,k)})"><rect x="524" y="1070" width="34" height="140" rx="17" fill="#b88a6a" stroke="#5a3a2c" stroke-width="5"/><ellipse cx="541" cy="1230" rx="56" ry="44" fill="#b88a6a" stroke="#5a3a2c" stroke-width="5"/></g>`:''}${tint('#1a2a4a',.35)}`};};
// 6 ушли вдвоём, как в первую ночь
S[6]=(lt,d)=>{const sw=Math.sin(lt*5)*14,k=lt/d;return {cam:{z:lerp(1.0,1.12,k),cx:540,cy:1300},svg:`${A.bgVillage()}${dark(.2)}${place(A.stranger({blank:false,arm:sw,arm2:-sw}),lerp(600,640,k),lerp(1700,1450,k),lerp(1.0,.55,k),-1)}${place(A.nikita({arm:-sw,arm2:sw}),lerp(430,500,k),lerp(1720,1470,k),lerp(1.0,.55,k),-1)}`};};
// 7 место обмена — та самая воронка
S[7]=(lt,d)=>({cam:{z:lerp(1.0,1.5,ease(lt/d)),cx:540,cy:1420},svg:`${A.bgCrater()}${smoke(lt,540,1400,7)}${flash(lt,0,.35)}`});
// 8 скупщик в дыму, руки чёрные
S[8]=(lt,d)=>{const tr=wt(8,'руки')-sceneStart(8),k=ease(lt/1.4);return lt<tr-.1?{cam:{z:1.05,cx:540,cy:1350},svg:`${A.bgCrater()}${place(A.buyer(),540,lerp(1500,1560,k),lerp(.7,1.0,k))}${smoke(lt,540,1500,8)}`}
 :{cam:{z:lerp(1.2,1.35,(lt-tr)/(d-tr)),cx:540,cy:1150},svg:`${A.bgCrater()}${dark(.3)}${place(A.buyer(),540,2100,1.9)}${F.blackHands(540,1720,1.9)}${flash(lt,tr-.1,.3)}`};};
// 9 открыл ящик — ядро как солнце
S[9]=(lt,d)=>{const to=wt(9,'открыл')-sceneStart(9)+.2,k=ease((lt-to)/.6),ty=wt(9,'ядро')-sceneStart(9);
 return {cam:{z:lerp(1.0,1.2,lt/d),cx:540,cy:1150,x:k>0&&k<1?Math.sin(lt*60)*6:0},svg:`<rect width="1080" height="1920" fill="#08070a"/>${C.leadBox(540,1300,2.2,k)}${lt>ty?E.core(540,1060,1.4*ease((lt-ty)/.5),lt):''}
 <rect width="1080" height="1920" fill="#ff9a4a" opacity="${lt>ty?.18+.08*Math.sin(lt*8):0}"/>${flash(lt,ty,.6,'#fff3c8')}`};};
// 10 «Это не всё»
S[10]=(lt,d)=>({cam:{z:lerp(1.3,1.5,lt/d),cx:540,cy:1050,x:Math.sin(lt*30)*3},svg:`${A.bgCrater()}${dark(.4)}${place(A.buyer(),540,2400,2.6).replace(/#e8f6ff/g,'#9aaab4')}<path d="M470,1110 L510,1140 M590,1100 L560,1150" stroke="#fff" stroke-width="3"/><path d="M500,1170 q20,30 0,60" stroke="#8a1010" stroke-width="8" fill="none"/>${tint('#ff9a4a',.1)}`});
// 11 «Ядер было два» — тишина, сердце
S[11]=(lt,d)=>{const beat=Math.pow(Math.abs(Math.sin(lt*3.4)),8);return {cam:{z:1.6+beat*.05,cx:540,cy:1080},svg:`${A.bgCrater()}${dark(.55)}${place(A.buyer(),540,2400,2.6)}${tint('#000',.25*beat)}`};};
// 12 «Второе упало на ваш посёлок» — разворот камеры
S[12]=(lt,d)=>{const k=ease(lt/.7);return {cam:{z:lerp(1.6,1.0,k),cx:540,cy:1000,x:lerp(-400,0,k)},svg:`<g transform="rotate(${lerp(-12,0,k)} 540 960)">${place(A.nikita({}),540,2400,3.4)}</g>${tint('#ff7a2a',.06)}`};};
// 13 над крышей моего дома — зарево
S[13]=(lt,d)=>{const tz=wt(13,'зарево')-sceneStart(13),g=ease((lt-tz+.6)/1.2),tEnd=T.lines[13].e-sceneStart(13)+1.0,tx=clamp((lt-tEnd)/.5);
 return {cam:{z:lerp(1.0,1.25,ease(lt/2.5)),cx:540,cy:1400,x:lt>tz&&lt<tz+.4?Math.sin(lt*60)*8:0},svg:`${A.bgVillage()}<circle cx="700" cy="1380" r="${100+g*700}" fill="url(#emberR)" opacity="${g}"/><rect x="600" y="1340" width="200" height="40" fill="#ffb347" opacity="${g*.8}"/>
 ${embers(lt*1.5,40,g)}${dark(tx*.85)}<g opacity="${tx}" font-family="Inter" text-anchor="middle"><text x="540" y="900" font-size="64" font-weight="900" fill="#ff9a4a" letter-spacing="4">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="1010" font-size="54" font-weight="700" fill="#6dffd2">Серия 7 — скоро</text></g>`};};

// ---------- субтитры ----------
const KEY={кровь:'#ff3030',ладонь:'#6dffd2',светилась:'#6dffd2',ядро:'#ff3030',руками:'#ff9a4a',ожог:'#ff5a4a',трещина:'#6dffd2',телефон:'#7ab8ff',скрыт:'#ff5a4a',майор:'#ffd24a',меняемся:'#ff3030',рассвета:'#ff3030',отдадим:'#ff5a4a',губам:'#ffffff',вдвоём:'#ffd24a',первую:'#ff9a4a',воронка:'#ff9a4a',дыму:'#c0c8d0',чёрные:'#ff5a4a',ожогов:'#ff5a4a',ящик:'#c0c8d0',солнце:'#ff9a4a',всё:'#ff5a4a',два:'#ff3030',второе:'#ff3030',посёлок:'#ff9a4a',дома:'#ff3030',зарево:'#ff9a4a'};
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
 const kw=T.words.filter(w=>w.s<=t&&KEY[w.w.toLowerCase().replace(/[^а-яё]/g,'')]).pop();if(kw)c.z*=1+.06*Math.exp(-(t-kw.s)*7);
 const cam=`translate(${540+c.x},${960+c.y}) scale(${c.z}) translate(${-c.cx},${-c.cy})`;
 const fadeIn=clamp(lt/.06),cut=i>0?fadeIn:1;
 const title=t<2.2?`<g font-family="Inter" text-anchor="middle" opacity="${clamp((2.2-t)/.4)}"><text x="540" y="390" font-size="30" font-weight="800" fill="#ff9a4a" letter-spacing="3">ПАДЕНИЕ МЕТЕОРИТА · СЕРИЯ 6</text></g>`:'';const hud=t<T.lines[13].e+.8?F.timerHUD(t,T.lines[13].e+.8):'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${A.defs()}
 <defs><radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="#000"/><g transform="${cam}">${r.svg}</g>
 ${[3,6,7,8,9].includes(i)?embers(t,30):''}
 <rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="#000" opacity="${(1-cut)*.9+0.04*hash(Math.floor(t*30))}"/>
 ${hud}${title}${subs(t)}</svg>`;};
})();
