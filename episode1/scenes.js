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
const S=[];
// 0 Один осколок стоил как квартира
S[0]=(lt,d)=>{const z=lerp(1.25,1.0,ease(lt/d)),p=.7+.3*Math.sin(lt*4);
 return {cam:{z,cx:540,cy:1000},svg:`${A.bgVillage()}<rect width="1080" height="1920" fill="#000" opacity=".45"/>
 ${hand(560,1080,2.0,-1)}${shard(470,990,2.4*p+0.2,1)}`};};
// 1 весь посёлок пошёл в лес
S[1]=(lt,d)=>{let dots='';for(let i=0;i<18;i++){const k=((lt*.12+i/18)%1);const x=lerp(120+i*45,560+Math.sin(i)*200,k),y=lerp(1560,1200,k);dots+=`<circle cx="${x}" cy="${y}" r="${10*(1-k*.6)}" fill="#fff6c8"/><circle cx="${x}" cy="${y}" r="${34*(1-k*.6)}" fill="#fff6c8" opacity=".25"/>`}
 return {cam:{z:lerp(1.0,1.12,lt/d),cx:540,cy:1300,x:Math.sin(lt*.5)*10},svg:A.bgVillage().replace(/class="win"/g,`opacity="${.6+.4*Math.sin(lt*9)}"`)+dots};};
// 2 Никита идёт по лесу
S[2]=(lt,d)=>{const off=(lt*90)%130,bob=Math.abs(Math.sin(lt*5))*12,sw=Math.sin(lt*5)*14;
 return {cam:{z:1.05,cx:540,cy:1100},svg:`<g transform="translate(${-off},0)">${A.bgForest(11)}</g><g transform="translate(${1080-off},0)">${A.bgForest(11)}</g>
 ${beamCone(640,1150,-100,900,320,'beamW',.45)}${place(A.nikita({arm:sw,arm2:-sw}),480,1700-bob,1.9)}`};};
// 3 у воронки — мужчина
S[3]=(lt,d)=>{const nx=lerp(-200,170,ease(lt/1.5));
 return {cam:{z:lerp(1.0,1.06,lt/d),cx:540,cy:1300},svg:`${A.bgCrater()}${smoke(lt,540,1400)}
 ${place(A.stranger({arm:4+Math.sin(lt)*2,arm2:-4}),700,1430,1.25)}
 ${beamCone(nx+90,1280,-72,700,240,'beamW',.55)}${place(A.nikita({arm:0,arm2:-70}),nx,1640,1.5)}`};};
// 4 Он был там первым
S[4]=(lt,d)=>{const k=ease(lt/d);
 return {cam:{z:lerp(1.2,2.3,k),cx:700,cy:lerp(1250,880,k)},svg:`${A.bgCrater()}${smoke(lt+5,540,1400)}${place(A.stranger({}),700,1430,1.25)}`};};
// 5 нагнулся и спрятал камень
S[5]=(lt,d,t)=>{const th=wt(5,'спрятал')-sceneStart(5),k=ease((lt-th)/.5);
 const svg=`${A.bgCrater()}<rect width="1080" height="1920" fill="#000" opacity=".3"/>
 ${place(A.stranger({hold:k<1,arm2:lerp(-55,-6,k),shard:k>0.5?30+6*Math.sin(lt*6):0}),560,2150,2.2)}
 ${place(A.nikita({}),-40,2300,2.6)}`;
 return {cam:{z:1.0,cx:540,cy:960,y:Math.sin(lt)*6},svg};};
// 6 охотники делят находку
S[6]=(lt,d)=>{const tb=wt(6,'скупщик')-sceneStart(6),tug=Math.sin(lt*7)*14,fl=lt>tb&&lt<tb+.15;
 return {cam:{z:1.1+(lt>tb?.08:0),cx:540,cy:1300,x:fl?12:0},svg:`${A.bgForest(23)}
 ${beamCone(380,1060,-60+Math.sin(lt*5)*25,800,200,'beamW',.5)}${beamCone(700,1060,60+Math.sin(lt*4+1)*25,800,200,'beamW',.5)}
 ${place(A.hunter({color:'#5a3a2a',arm:-80+tug}),360,1600,1.1)}${place(A.hunter({color:'#2f4058',arm:-80-tug}),720,1600,1.1,-1)}
 <ellipse cx="${540+tug*2}" cy="1360" rx="70" ry="54" fill="#5e4a30"/>${shard(540+tug*2,1340,.5,.8)}
 ${fl?'<rect width="1080" height="1920" fill="#fff" opacity=".5"/>':''}`};};
// 7 хрустнула ветка — обернулся
S[7]=(lt,d)=>{const tc=wt(7,'хрустнул')-sceneStart(7),to=wt(7,'обернул')-sceneStart(7);
 if(lt<to-.2){const k=ease((lt-tc+.3)/.4),snap=lt>tc;
  return {cam:{z:1.0,cx:540,cy:960,x:snap&&lt<tc+.2?10*Math.sin(lt*80):0},svg:`<rect width="1080" height="1920" fill="#080d0b"/><rect y="1300" width="1080" height="620" fill="#0f1714"/>
  <g transform="translate(540,1330) rotate(${snap?-14:0})"><rect x="-420" y="-12" width="420" height="24" rx="10" fill="#4a3826"/></g>
  <g transform="translate(540,1330) rotate(${snap?14:0})"><rect x="0" y="-12" width="420" height="24" rx="10" fill="#4a3826"/></g>
  <g transform="translate(560,${lerp(500,1080,k)})"><rect x="-150" y="0" width="300" height="200" rx="40" fill="#0b0b0b"/><rect x="-100" y="-700" width="180" height="720" fill="#262a1e"/></g>`};}
 const k=ease((lt-to)/.25);
 return {cam:{z:1,cx:540,cy:960},svg:`${A.bgForest(31)}<rect width="1080" height="1920" fill="#000" opacity=".35"/>
 ${place(A.stranger({blank:false}),540,2500,2.8,lerp(1,-1,k))}`};};
// 8 драка, уходим оврагом
S[8]=(lt,d)=>{const fl=hash(Math.floor(lt*8))>.75,x=lerp(900,150,lt/d),bob=Math.abs(Math.sin(lt*9))*18,sw=Math.sin(lt*9)*35;
 return {cam:{z:1.1,cx:540,cy:1200,x:Math.sin(lt*31)*8,y:Math.cos(lt*27)*8},svg:`${A.bgForest(41)}
 ${place(A.hunter({color:'#1b1b1b',arm:-100}),220,1300,.6)}${place(A.hunter({color:'#1b1b1b',arm:-40}),320,1300,.6,-1)}
 ${beamCone(250,1020,Math.sin(lt*13)*80,600,160,'beamW',.6)}
 <path d="M0,1650 Q540,1500 1080,1700 L1080,1920 L0,1920Z" fill="#050807"/>
 ${place(A.stranger({arm:sw,arm2:-sw}),x+180,1720+bob+(900-x)*.12,1.1,-1)}${place(A.nikita({arm:-sw,arm2:sw}),x,1740+bob+(900-x)*.12,1.1,-1)}
 ${fl?'<rect width="1080" height="1920" fill="#fff" opacity=".25"/>':''}`};};
// 9 горячий ветер, ручей, рыба
S[9]=(lt,d)=>{let st='';for(let i=0;i<8;i++){const k=(lt*.3+i/8)%1;st+=`<ellipse cx="${100+i*130+Math.sin(lt+i)*20}" cy="${1350-k*500}" rx="${50+k*60}" ry="${30+k*40}" fill="#aab" opacity="${.18*(1-k)}" filter="url(#blur20)"/>`}
 const kneel=ease((lt-1.2)/.6);
 return {cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1300},svg:`${A.bgStream()}${st}
 ${place(A.stranger({arm:20,arm2:-20}),720,lerp(1560,1700,kneel),1.1)}${place(A.nikita({}),330,1580,1.05)}
 <path d="M-20,1920 L-20,1620 Q300,1560 560,1680 Q800,1600 1100,1660 L1100,1920Z" fill="#0a100e"/>`};};
// 10 последняя чистая вода — отдал
S[10]=(lt,d)=>{const tg=wt(10,'отдал')-sceneStart(10),k=ease((lt-tg)/.8);
 return {cam:{z:lerp(1.05,1.2,lt/d),cx:540,cy:1000},svg:`${A.bgStream()}<rect width="1080" height="1920" fill="#000" opacity=".55"/>
 ${hand(lerp(330,640,k)-170,1180,1.4)}${bottle(lerp(330,640,k),1060,1.6,lt)}
 ${k>.3?hand(980,1100,1.4,-1,'#c99a7a','#3c4329'):''}`};};
// 11 прожекторы, военные гонят
S[11]=(lt,d)=>{let ppl='';for(let i=0;i<6;i++){const x=((lt*260+i*260)%1500)-200;ppl+=place(A.hunter({color:'#111',arm:Math.sin(lt*10+i)*40}),x,1650-i%2*60,.5)}
 return {cam:{z:1.08,cx:540,cy:1100,x:Math.sin(lt*21)*5},svg:`${A.bgForest(51)}
 ${beamCone(200,-50,-30+Math.sin(lt*1.3)*35,2300,500,'beam',.55)}${beamCone(900,-50,25+Math.sin(lt*1.1+2)*35,2300,500,'beam',.55)}
 ${ppl}<rect width="1080" height="1920" fill="#fff" opacity="${hash(Math.floor(lt*6))>.85?.12:0}"/>`};};
// 12 солдат пропустил
S[12]=(lt,d)=>{const tp=wt(12,'пропустил')-sceneStart(12),k=ease((lt-tp+.3)/.6),wx=lerp(-150,330,clamp(lt/d)),sw=Math.sin(lt*6)*12;
 return {cam:{z:1.1,cx:540,cy:1200},svg:`${A.bgForest(61)}${beamCone(540,-80,Math.sin(lt*.8)*30,2300,600,'beam',.4)}
 ${place(A.soldier(),lerp(600,820,k),1680,1.3)}${place(A.stranger({arm:sw,arm2:-sw}),wx+140,1700,1.25)}${place(A.nikita({arm:-sw,arm2:sw}),wx,1720,1.25)}`};};
// 13 обрыв, скупщик
S[13]=(lt,d)=>{let q='';for(let i=0;i<5;i++)q+=place(A.hunter({color:'#15181c',arm:-20}),300-i*80+i*i*4,1440+i*8,.45+i*.02);
 return {cam:{z:lerp(1.0,1.18,lt/d),cx:620,cy:1300},svg:`${A.bgCliff()}${place(A.buyer(),620,1470,.75)}${q}
 ${smoke(lt,200,1100,4)}`};};
// 14 молчун отдал камень даром
S[14]=(lt,d)=>{const tg=wt(14,'отдал')-sceneStart(14),k=ease((lt-tg+.4)/.6),nod=lt>tg+.6&&lt<tg+1.4?Math.sin((lt-tg-.6)*Math.PI/.8)*12:0;
 return {cam:{z:1.0,cx:540,cy:1100},svg:`${A.bgCliff()}<rect width="1080" height="1920" fill="#000" opacity=".2"/>
 ${place(A.stranger({arm2:lerp(-6,-70,k),hold:true}),330,1780,1.35)}
 <g transform="translate(790,1780) rotate(${-nod*.3}) translate(0,${nod})">${place(A.buyer(),0,0,1.35,-1)}</g>`};};
// 15 открыл чемодан
S[15]=(lt,d)=>{const to=wt(15,'открыл')-sceneStart(15),k=ease((lt-to)/.7),g=k*1.0;
 return {cam:{z:lerp(1.0,1.15,lt/d),cx:540,cy:1100},svg:`<rect width="1080" height="1920" fill="#06080c"/>
 <circle cx="540" cy="1050" r="${200+k*700}" fill="url(#glowR)" opacity="${g*.7}"/>
 <rect x="140" y="1050" width="800" height="380" rx="24" fill="#9aa3ad"/><rect x="140" y="1050" width="800" height="40" fill="#7c858f"/>
 <g transform="translate(0,1050) scale(1,${lerp(1,-0.55,k)})"><rect x="140" y="-300" width="800" height="300" rx="24" fill="#b3bcc6"/><rect x="460" y="-330" width="160" height="50" rx="12" fill="none" stroke="#6c737b" stroke-width="18"/></g>
 <rect x="300" y="1060" width="40" height="60" fill="#444"/><rect x="740" y="1060" width="40" height="60" fill="#444"/>
 <rect width="1080" height="1920" fill="#fff" opacity="${lt>to&&lt<to+.1?.5:0}"/>`};};
// 16 сотни таких же камней
S[16]=(lt,d)=>{const k=ease(lt/d),tz=wt(16,'будто')-sceneStart(16);
 if(lt>tz+.6){const kk=ease((lt-tz-.6)/1);return {cam:{z:lerp(1.3,1.6,kk),cx:540,cy:900},svg:`<rect width="1080" height="1920" fill="#05070c"/><rect width="1080" height="1920" fill="#6dffd2" opacity=".08"/>${place(A.nikita({}),540,1700,2.6).replace(/#c99a7a/g,'#9fcab8')}`};}
 let st='';for(let r=0;r<22;r++)for(let c=0;c<14;c++){const x=40+c*74+(r%2)*37,y=80+r*82,p=.6+.4*Math.sin(lt*3+r*.7+c*1.3);st+=`<g transform="translate(${x},${y}) rotate(${(r*31+c*17)%40-20}) scale(.75)" opacity="${p}"><path d="M-26,8 L-10,-30 L18,-24 L30,4 L8,30 L-20,26Z" fill="#2fae8f"/><path d="M-10,-30 L18,-24 L4,0 L-26,8Z" fill="#9dffe4"/></g>`}
 return {cam:{z:lerp(2.4,1.0,k),cx:540,cy:960},svg:`<rect width="1080" height="1920" fill="#0c1a18"/><circle cx="540" cy="960" r="900" fill="url(#glowR)" opacity=".25"/>${st}`};};
// 17 что упало в наш лес?
S[17]=(lt,d)=>{const k=ease(lt/3.2),tEnd=T.lines[17].e-sceneStart(17)+.4,tx=clamp((lt-tEnd)/.6);
 return {cam:{z:1.0,cx:540,cy:960,y:lerp(-700,0,k)},svg:`<g transform="translate(0,700)">${A.bgVillage()}</g>
 <rect y="0" width="1080" height="800" fill="#05070e"/><circle cx="560" cy="1150" r="${500+60*Math.sin(lt*3)}" fill="url(#emberR)" opacity=".7"/>
 <rect width="1080" height="1920" fill="#000" opacity="${tx*.75}"/>
 <g opacity="${tx}" font-family="Inter" text-anchor="middle"><text x="540" y="900" font-size="64" font-weight="900" fill="#ff9a4a" letter-spacing="4">ПАДЕНИЕ МЕТЕОРИТА</text>
 <text x="540" y="1010" font-size="54" font-weight="700" fill="#6dffd2">Серия 2 — скоро</text></g>`};};

// ---------- субтитры ----------
const KEY={осколок:'#ff9a4a',квартира:'#ff9a4a',первым:'#ff5a4a',камень:'#6dffd2',миллион:'#ffd24a',глухой:'#ff5a4a',бутылка:'#7fc8e8',вода:'#7fc8e8',воды:'#7fc8e8',отдал:'#ffd24a',чемодан:'#ff9a4a',сотни:'#6dffd2',камней:'#6dffd2',заранее:'#ff5a4a',упало:'#ff5a4a',скупщик:'#ffd24a',осколки:'#ff9a4a',прожекторы:'#ffffff',даром:'#ffd24a',воронки:'#ff9a4a',скупщикдаст:'#ffd24a'};
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
 const title=t<3.2?`<g font-family="Inter" text-anchor="middle" opacity="${clamp((3.2-t)/.5)}"><text x="540" y="230" font-size="54" font-weight="900" fill="#ff9a4a" letter-spacing="3">ПАДЕНИЕ МЕТЕОРИТА</text><text x="540" y="300" font-size="40" font-weight="700" fill="#e9e2d0">Серия 1 · «Кто первый»</text></g>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${A.defs()}
 <defs><radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="#000"/><g transform="${cam}">${r.svg}</g>
 ${i!==15&&i!==16?embers(t,i===0||i===17?55:35):''}
 <rect width="1080" height="1920" fill="url(#vig)"/><rect width="1080" height="1920" fill="#000" opacity="${(1-cut)*.9+0.04*hash(Math.floor(t*30))}"/>
 ${title}${subs(t)}</svg>`;};
})();
