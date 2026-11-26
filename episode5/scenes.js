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
const B=window.B,C=window.C,D=window.D,E=window.E;const S=[];
const dark=(o)=>`<rect width="1080" height="1920" fill="#000" opacity="${o}"/>`;
const tint=(c,o)=>`<rect width="1080" height="1920" fill="${c}" opacity="${o}"/>`;
const flash=(lt,at,o=.55)=>lt>at&&lt<at+.12?`<rect width="1080" height="1920" fill="#fff" opacity="${o}"/>`:'';
const stars=(lt)=>[...Array(70)].map((_,i)=>`<circle cx="${hash(i)*1080}" cy="${hash(i+9)*1400}" r="${1+hash(i+3)*2.5}" fill="#fff" opacity="${.3+.5*Math.abs(Math.sin(lt*2+i))}"/>`).join('');
const seated=(svg,x,y,s,flip=1)=>`<g transform="translate(${x},${y}) scale(${s*flip},${s})"><g transform="translate(0,190)">${svg}</g></g>`;
// 0 «Какое ядро?» — пустые глаза
S[0]=(lt,d)=>({cam:{z:lerp(1.1,1.3,lt/d),cx:540,cy:1000},svg:`${C.bgDawn()}${dark(.3)}${place(A.stranger({blank:true}),540,2500,2.8)}
 <circle cx="500" cy="1068" r="5" fill="#fff6d0"/><circle cx="578" cy="1068" r="5" fill="#fff6d0"/>${tint('#fff6d0',.05+.04*Math.sin(lt*3))}`});
// 1 грузовик, солдаты
S[1]=(lt,d)=>{const j=Math.sin(lt*14)*4;return {cam:{z:1.05,cx:540,cy:1200,y:j},svg:`${E.truckInside(lt)}${seated(A.soldier(),140,1640,1.0)}${seated(A.soldier(),950,1640,1.0,-1)}
 ${seated(A.nikita({arm:20,arm2:-20}),400,1680,1.05)}${seated(A.stranger({blank:true}),680,1670,1.05,-1)}`};};
// 2 таблетка йода
S[2]=(lt,d)=>{const tr=Math.sin(lt*30)*3;return {cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1050},svg:`${E.truckInside(lt)}${dark(.55)}${hand(560+tr,1150,2.2,-1)}${E.pill(470+tr,1050,1.6)}`};};
// 3 услышал правду — рация
S[3]=(lt,d)=>({cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:900},svg:`${E.truckInside(lt)}${place(D.officer({}),540,2400,2.6)}<rect x="700" y="1150" width="70" height="140" rx="10" fill="#1a1d14"/><circle cx="735" cy="1170" r="10" fill="${Math.sin(lt*10)>0?'#ff3030':'#401010'}"/>${tint('#ff3030',Math.sin(lt*10)>0?.04:0)}`});
// 4 упал спутник
S[4]=(lt,d)=>{const ts=wt(4,'спутник')-sceneStart(4),tv=wt(4,'военный')-sceneStart(4),k=clamp(lt/d),br=ease((lt-tv)/.8);
 return {cam:{z:1.0,cx:540,cy:960,x:br>0?Math.sin(lt*40)*4:0},svg:`<rect width="1080" height="1920" fill="url(#skyCold)"/>${stars(lt)}
 ${lt<ts-.2?C.fallingShard(lerp(300,700,k),lerp(500,1200,k),1.4):E.satellite(lerp(420,640,k),lerp(700,1100,k),.9,lt,br)}${flash(lt,tv)}`};};
// 5 ядро — кулак и печка
S[5]=(lt,d)=>({cam:{z:lerp(1.0,1.3,ease(lt/d)),cx:540,cy:960},svg:`<rect width="1080" height="1920" fill="#0a0604"/>${E.core(540,960,2.2,lt)}`});
// 6 знали заранее — карта, точки
S[6]=(lt,d)=>{const ws=T.words.filter(w=>w.line===6&&/поэтому/i.test(w.w)).map(w=>w.s-sceneStart(6));const n=ws.filter(x=>lt>x).length;
 return {cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:960},svg:`<rect width="1080" height="1920" fill="#121510"/>${D.map(540,960,1.3,{k:4,hl:n>=2?(Math.sin(lt*8)>0?1:0):0})}${n>=1?`<g opacity="${.7}"><circle cx="540" cy="934" r="${170+10*Math.sin(lt*5)}" fill="none" stroke="#ff3030" stroke-width="8"/></g>`:''}`};};
// 7 отряд раскладывает стекляшки
S[7]=(lt,d)=>{let gl='';const n=Math.floor(clamp(lt/d)*14);for(let i=0;i<n;i++)gl+=B.fakeShard(100+hash(i)*880,1500+hash(i+4)*300,.5,.9);
 return {cam:{z:1.05,cx:540,cy:1350},svg:`${A.bgForest(151)}${dark(.45)}${gl}${place(A.soldier(),lerp(260,420,lt/d),1700,1.0)}${place(A.soldier(),lerp(820,660,lt/d),1690,1.0,-1)}`};};
// 8 скупщик продавал настоящие
S[8]=(lt,d)=>{const tn=wt(8,'настоящие')-sceneStart(8);return {cam:{z:lerp(1.2,1.35,lt/d),cx:580,cy:1250},svg:`${A.bgCliff()}${place(A.buyer(),640,1650,1.2)}${C.bills(480,1330,.7,lt)}${lt>tn?B.realShard(760,1380,.8,Math.abs(Math.sin(lt*3))):''}`};};
// 9 майор забрал осколок — мишень
S[9]=(lt,d)=>{const tm=wt(9,'мишенью')-sceneStart(9),beat=Math.pow(Math.abs(Math.sin(lt*3.2)),6);
 return {cam:{z:1.0,cx:540,cy:1100},svg:`<rect width="1080" height="1920" fill="#06120f"/>${place(A.stranger({blank:false,shard:20+40*beat,hold:lt<1.2}),540,2350,2.4)}${tint('#6dffd2',.1)}
 ${lt>tm-.3?E.laser(lerp(900,560,ease((lt-tm+.3)/.6)),lerp(800,1350,ease((lt-tm+.3)/.6)),lt):''}`};};
// 10 «без майора ядро не найти»
S[10]=(lt,d)=>{const te=T.lines[10].e-sceneStart(10);return {cam:{z:1.0,cx:540,cy:1000,x:lt>te&&lt<te+.2?Math.sin(lt*80)*10:0},svg:`${E.truckInside(lt)}${dark(.3)}${place(D.officer({}),400,2200,2.0)}<g transform="rotate(-8 760 1250)">${D.map(760,1250,.45,{k:4})}</g>${flash(lt,te,.3)}`};};
// 11 майор смотрит в окно
S[11]=(lt,d)=>({cam:{z:lerp(1.0,1.1,lt/d),cx:540,cy:1100},svg:`${E.truckInside(lt)}${place(A.stranger({blank:true}),540,2100,1.7,-1)}`});
// 12 закрыл глаза — свист с неба
S[12]=(lt,d)=>{const ts=wt(12,'свист')-sceneStart(12),k=clamp((lt-ts+.2)/1.2);return {cam:{z:1.0,cx:540,cy:960},svg:lt<ts-.3?`<rect width="1080" height="1920" fill="#000"/>`:`${C.bgDawn()}${dark(.5)}${C.fallingShard(lerp(200,560,k),lerp(200,1500,k),1)}`};};
// 13 маленький, тёплый
S[13]=(lt,d)=>({cam:{z:lerp(1.0,1.2,lt/d),cx:540,cy:1100},svg:`<rect width="1080" height="1920" fill="#0d1512"/>${C.smallShard(540,1150,4,lt,1)}`});
// 14 три тысячи — он знал
S[14]=(lt,d)=>{const tz=wt(14,'знал')-sceneStart(14);return {cam:{z:1.0,cx:540,cy:1000},svg:lt<tz-.1?`<rect width="1080" height="1920" fill="#0a0d10"/>${C.bills(540,1000,1.8,lt)}`:`${A.bgForest(141)}${dark(.4)}${place(A.buyer(),540,2300,2.4,-1)}<circle cx="${560}" cy="${1110}" r="40" fill="#e8f6ff" opacity="${.4*Math.abs(Math.sin(lt*4))}" filter="url(#blur8)"/>`};};
// 15 ядро держал в руках я — и отшвырнул
S[15]=(lt,d)=>{const ty=wt(15,'отшвырнул')-sceneStart(15),k=ease((lt-ty)/1.2);
 return {cam:{z:1.05,cx:540,cy:1400},svg:`${D.bgRavineEdge()}${lt<ty?`${hand(600,1200,2,-1)}${E.core(500,1100,.6,lt)}`:`<g opacity="${1-ease((lt-ty-.6)/.8)}" transform="rotate(${k*720} ${lerp(500,540,k)} ${lerp(1100,1600,k)})">${C.smallShard(lerp(500,540,k),lerp(1100,1600,k),1.2,lt,.3)}</g>`}`};};
// 16 «Стой! Я знаю, где оно»
S[16]=(lt,d)=>({cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:760,x:Math.sin(lt*50)*5},svg:`${E.truckInside(lt)}${place(A.nikita({}),540,2400,3.6)}${tint('#ff3030',.08)}${flash(lt,.1,.25)}`});
// 17 грузовик развернулся
S[17]=(lt,d)=>{const k=ease(lt/d);return {cam:{z:1.0,cx:540,cy:1450},svg:`${C.bgDawn()}${dark(.25)}${D.truck(540,1600,1.0*lerp(1,-1,k)).replace('scale(','scale(').replace(/scale\(([-\d.]+)\)/,(m,v)=>`scale(${v},1)`)}`};};
// 18 первым спустился вниз
S[18]=(lt,d)=>{const k=ease(lt/d);return {cam:{z:1.1,cx:540,cy:lerp(700,1500,k)},svg:`${D.bgRavineEdge()}${beamCone(lerp(380,520,k)+60,lerp(800,1380,k)-280,-20,700,220,'beamW',.5)}${place(A.nikita({arm:-20,arm2:-70}),lerp(380,520,k),lerp(800,1380,k),.8)}`};};
// 19 на дне пусто
S[19]=(lt,d)=>({cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1450},svg:`${E.ravineBottom()}${beamCone(540,700,Math.sin(lt*1.2)*30,1000,320,'beamW',.55)}`});
// 20 разбитые очки скупщика
S[20]=(lt,d)=>{const tEnd=T.lines[20].e-sceneStart(20)+1.0,tx=clamp((lt-tEnd)/.6);return {cam:{z:lerp(1.3,1.0,ease(lt/2.5)),cx:540,cy:1100},svg:`${E.ravineBottom()}${beamCone(540,500,0,1000,420,'beamW',.4)}${E.glassesBroken(540,1150,1.6,lt)}
 ${dark(tx*.85)}<g opacity="${tx}" font-family="Inter" text-anchor="middle"><text x="540" y="900" font-size="64" font-weight="900" fill="#ff9a4a" letter-spacing="4">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="1010" font-size="54" font-weight="700" fill="#6dffd2">Серия 6 — скоро</text></g>`};};

// ---------- субтитры ----------
const KEY={ядро:'#ff3030',майор:'#ffd24a',грузовик:'#c9a24a',йода:'#f4f1e8',правду:'#ffffff',метеорит:'#ff9a4a',спутник:'#7ab8ff',военный:'#7ab8ff',кулак:'#ff9a4a',печка:'#ff9a4a',заранее:'#ff5a4a',поэтому:'#f2c230',стекляшки:'#6dffd2',смерть:'#ff3030',настоящие:'#6dffd2',осколок:'#6dffd2',мишенью:'#ff3030',молчал:'#ff5a4a',свист:'#ffd27a',тёплый:'#ff9a4a',знал:'#ff5a4a',овраг:'#ff9a4a',стой:'#ff3030',первым:'#ffd24a',пусто:'#ff5a4a',очки:'#e8f6ff',скупщика:'#ffd24a'};
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
 const title=t<3.2?`<g font-family="Inter" text-anchor="middle" opacity="${clamp((3.2-t)/.5)}"><text x="540" y="230" font-size="54" font-weight="900" fill="#ff9a4a" letter-spacing="3">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="300" font-size="40" font-weight="700" fill="#e9e2d0">Серия 5 · «Ядро»</text></g>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${A.defs()}
 <defs><radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="#000"/><g transform="${cam}">${r.svg}</g>
 ${[4,7,8,12].includes(i)?embers(t,25):''}
 <rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="#000" opacity="${(1-cut)*.9+0.04*hash(Math.floor(t*30))}"/>
 ${title}${subs(t)}</svg>`;};
})();
