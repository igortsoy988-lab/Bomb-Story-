// Новая графика серии 3. Стиль и палитра — из episode1/art.js и episode2/art2.js (их не меняем).
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647;}}
function campfire(x,y,s=1,t=0,power=1){let fl='';for(let i=0;i<5;i++){const h=(110+40*Math.sin(t*9+i*2))*power,w=34+i%2*12,dx=-60+i*30;fl+=`<path d="M${dx-w/2},0 Q${dx-w/2},${-h*.5} ${dx+Math.sin(t*7+i)*10},${-h} Q${dx+w/2},${-h*.5} ${dx+w/2},0Z" fill="${i%2?'#ffb347':'#ff6a1a'}" opacity=".9"/>`}
 return `<g transform="translate(${x},${y}) scale(${s})"><circle r="${260*power+20*Math.sin(t*11)}" cy="-40" fill="url(#emberR)" opacity="${.55*power}"/>
 <rect x="-110" y="-10" width="220" height="26" rx="12" fill="#2a1a10" transform="rotate(14)"/><rect x="-110" y="-10" width="220" height="26" rx="12" fill="#22140c" transform="rotate(-14)"/>
 ${power>0.05?fl:''}${[...Array(7)].map((_,i)=>`<circle cx="${-60+i*20}" cy="8" r="7" fill="${i%2?'#ff7a2a':'#a8300c'}"/>`).join('')}</g>`;}
function shadowThief(x,y,s=1,reach=0){return `<g transform="translate(${x},${y}) scale(${s})" opacity=".92">
 <path d="M-70,0 L-60,-330 Q0,-380 60,-330 L80,0Z" fill="#020304"/><ellipse cx="0" cy="-400" rx="52" ry="60" fill="#020304"/>
 <path d="M-70,-420 Q0,-500 70,-420 L80,-400 L-80,-400Z" fill="#020304"/>
 <g transform="rotate(${-40-reach*30} 40 -300)"><rect x="30" y="-310" width="40" height="190" rx="18" fill="#020304"/>
 <path d="M50,-130 L${40-reach*10},${110+reach*60} M58,-130 L${70+reach*10},${110+reach*60}" stroke="#7d848c" stroke-width="7" stroke-linecap="round"/></g></g>`;}
function tongsShard(x,y,s=1,p=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-12,-420 L-8,-40 M12,-420 L8,-40" stroke="#8a929b" stroke-width="10" stroke-linecap="round"/><rect x="-26" y="-470" width="52" height="70" rx="14" fill="#1b1d20"/></g>`;}
function fallingShard(x,y,s=1,k=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 L${-420*k},${-700*k}" stroke="#ffd27a" stroke-width="18" stroke-linecap="round" opacity=".35"/><path d="M0,0 L${-260*k},${-430*k}" stroke="#fff3c8" stroke-width="8" stroke-linecap="round" opacity=".8"/><circle r="40" fill="url(#emberR)"/><circle r="12" fill="#fff8e0"/></g>`;}
function smallShard(x,y,s=1,t=0,steam=1){let st='';for(let i=0;i<4;i++){const k=(t*.6+i/4)%1;st+=`<circle cx="${Math.sin(t*3+i)*20}" cy="${-30-k*180}" r="${10+k*24}" fill="#d8dde0" opacity="${.45*(1-k)*steam}" filter="url(#blur8)"/>`}
 return `<g transform="translate(${x},${y}) scale(${s})"><circle r="70" fill="url(#emberR)" opacity=".5"/><circle r="50" fill="url(#glowR)" opacity=".5"/>
 <path d="M-22,4 L-14,-18 L4,-24 L20,-12 L24,8 L8,22 L-12,20Z" fill="#1a1d22"/><path d="M-12,-2 L-2,-14 L8,-6 L2,6Z" fill="#ff9a4a"/><path d="M6,8 L16,-2 L18,8Z" fill="#6dffd2"/>
 ${[...Array(6)].map((_,i)=>`<circle cx="${-60+i*24}" cy="${18+(i%2)*6}" r="5" fill="#bfe6ff" opacity="${.7*(1-steam*.5)}"/>`).join('')}${st}</g>`;}
function phoneSparks(x,y,s=1,t=0,n=60){const r=rnd(Math.floor(t*12)+1);let sp='';for(let i=0;i<n;i++)sp+=`<rect x="${-140+r()*280}" y="${-290+r()*580}" width="${2+r()*5}" height="${2+r()*5}" fill="#fff" opacity="${.4+r()*.6}"/>`;
 return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-160" y="-320" width="320" height="640" rx="40" fill="#101216"/><rect x="-144" y="-296" width="288" height="592" rx="26" fill="#0e1410"/>
 <circle cy="80" r="160" fill="#1a2a20"/><path d="M-60,90 L-36,40 L10,30 L52,56 L60,100 L24,140 L-30,134Z" fill="#2a2e33"/><circle cy="80" r="110" fill="url(#glowR)" opacity=".25"/>
 ${sp}<rect x="-144" y="-296" width="288" height="50" rx="20" fill="#000" opacity=".5"/><circle cx="110" cy="-272" r="10" fill="#ff3030"/><text x="-120" y="-262" font-family="Inter" font-size="22" fill="#ddd">REC</text></g>`;}
function leadBox(x,y,s=1,open=0){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-110" width="300" height="160" rx="10" fill="#5d636a"/><rect x="-150" y="-110" width="300" height="24" fill="#4a4f55"/>
 <path d="M-120,-60 h240 M-120,-20 h240" stroke="#4a4f55" stroke-width="6"/>
 <g transform="translate(0,-110) scale(1,${1-open*1.4})"><rect x="-160" y="-60" width="320" height="60" rx="10" fill="#6d737a"/></g>
 ${radSign(0,-20,.28,'#f2c230','#1a1a1a')}<text x="0" y="40" text-anchor="middle" font-family="Inter" font-weight="900" font-size="26" fill="#2c3035">Pb</text></g>`;}
function dosimeter(x,y,s=1,needle=0){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-120" y="-170" width="240" height="320" rx="30" fill="#e0b21c"/><rect x="-90" y="-140" width="180" height="120" rx="12" fill="#f4f0dc"/>
 <path d="M-70,-40 A90,90 0 0 1 70,-40" stroke="#333" stroke-width="4" fill="none"/><path d="M40,-82 A90,90 0 0 1 70,-40" stroke="#d01818" stroke-width="10" fill="none"/>
 <g transform="translate(0,-30) rotate(${-60+needle*120})"><path d="M0,0 L0,-96" stroke="#111" stroke-width="5"/></g><circle cy="-30" r="8" fill="#111"/>
 <circle cx="-50" cy="60" r="26" fill="#222"/><circle cx="50" cy="60" r="26" fill="#222"/><rect x="-70" y="110" width="140" height="20" rx="8" fill="#9c7c10"/>
 <text x="0" y="-108" text-anchor="middle" font-family="Inter" font-size="20" font-weight="700" fill="#555">ДП-5</text></g>`;}
function radSign(x,y,s=1,bg='#f2c230',fg='#111'){let b='';for(let i=0;i<3;i++)b+=`<path d="M0,0 L${Math.cos((i*120-90-30)*Math.PI/180)*90},${Math.sin((i*120-90-30)*Math.PI/180)*90} A90,90 0 0 1 ${Math.cos((i*120-90+30)*Math.PI/180)*90},${Math.sin((i*120-90+30)*Math.PI/180)*90}Z" fill="${fg}"/>`;
 return `<g transform="translate(${x},${y}) scale(${s})"><circle r="120" fill="${bg}"/>${b}<circle r="30" fill="${bg}"/><circle r="20" fill="${fg}"/></g>`;}
function gloves(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40,0 L-40,-70 Q-40,-90 -24,-90 L-24,-120 Q-12,-134 0,-120 L0,-130 Q12,-144 24,-130 L24,-100 Q40,-104 40,-84 L40,0Z" fill="#d6c34a"/><rect x="-46" y="0" width="92" height="40" rx="8" fill="#b8a332"/></g>`;}
function burnChest(x,y,s=1,glow=1){return `<g transform="translate(${x},${y}) scale(${s})">
 <rect x="-300" y="-260" width="600" height="560" fill="#c99a7a"/><path d="M-300,-260 L-120,-260 L-60,300 L-300,300Z" fill="#4a5236"/><path d="M300,-260 L120,-260 L60,300 L300,300Z" fill="#3c4329"/>
 <path d="M-120,-260 L-60,300 M120,-260 L60,300" stroke="#2f3421" stroke-width="10"/>
 <g transform="translate(0,20) scale(3)"><path d="M-34,6 L-22,-28 L4,-38 L30,-18 L36,10 L14,34 L-18,30Z" fill="#b8341f" opacity="${.65+.3*glow}"/><path d="M-26,4 L-16,-20 L4,-28 L24,-14 L28,8 L10,26 L-14,22Z" fill="#e0533a" opacity="${.5*glow}"/></g></g>`;}
function bills(x,y,s=1,t=0){return `<g transform="translate(${x},${y}) scale(${s})">${[0,1,2].map(i=>`<g transform="translate(${i*36-36},${i*-10}) rotate(${-14+i*12+Math.sin(t*4+i)*6})"><rect x="-90" y="-46" width="180" height="92" rx="6" fill="#6a8fbf"/><rect x="-78" y="-36" width="156" height="72" fill="none" stroke="#9cbbe0" stroke-width="4"/><text y="14" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#e8f0ff">1000</text></g>`).join('')}</g>`;}
function bgDawn(){let pines='';const r=rnd(17);for(let i=0;i<24;i++){const x=i*48-20+r()*20,h=240+r()*240;pines+=`<path d="M${x},${1250-h} L${x+h*.28},1250 L${x-h*.28},1250Z" fill="#141a22"/>`}
 return `<defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2436"/><stop offset=".35" stop-color="#4a5878"/><stop offset=".58" stop-color="#e0a27a"/><stop offset=".66" stop-color="#f6cf9e"/></linearGradient></defs>
 <rect width="1080" height="1920" fill="url(#dawn)"/>${pines}<rect y="1240" width="1080" height="680" fill="#1c2128"/>
 ${[...Array(5)].map((_,i)=>`<ellipse cx="${i*260}" cy="${1260+i%2*60}" rx="380" ry="90" fill="#c8ccd8" opacity=".18" filter="url(#blur40)"/>`).join('')}`;}
module.exports={campfire,shadowThief,tongsShard,fallingShard,smallShard,phoneSparks,leadBox,dosimeter,radSign,gloves,burnChest,bills,bgDawn};
