// Новая графика серии 6. Стиль — из прошлых серий.
// ладонь Никиты: свечение изнутри и ползущая трещина-ожог (k 0..1)
function palm(x,y,s=1,t=0,k=0){const p=.6+.4*Math.sin(t*5);const crack=`M-20,10 L10,-20 L0,-50 L30,-80 L20,-120 L50,-150`;
 return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-120" y="120" width="240" height="320" rx="60" fill="#2a382f"/>
 <ellipse cx="0" cy="40" rx="150" ry="170" fill="#c99a7a"/>${[-100,-40,25,85].map((fx,i)=>`<rect x="${fx-24}" y="${-260+Math.abs(i-1.5)*30}" width="50" height="210" rx="25" fill="#c99a7a"/>`).join('')}
 <rect x="110" y="-40" width="50" height="160" rx="25" fill="#c99a7a" transform="rotate(35 135 40)"/>
 <ellipse cx="0" cy="30" rx="110" ry="120" fill="url(#glowR)" opacity="${.45*p}"/>
 <path d="${crack}" stroke="#6dffd2" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="${400-400*k}"/>
 <path d="${crack}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="400" stroke-dashoffset="${400-400*k}" opacity=".8"/></g>`;}
function phoneCall(x,y,s=1,t=0){const v=Math.sin(t*60)*4;const ring=(t*2)%1;return `<g transform="translate(${x+v},${y}) scale(${s})">
 <circle r="${200+ring*200}" fill="none" stroke="#7ab8ff" stroke-width="6" opacity="${1-ring}"/>
 <rect x="-160" y="-320" width="320" height="640" rx="40" fill="#101216"/><rect x="-144" y="-296" width="288" height="592" rx="26" fill="#0b0f18"/>
 <circle cy="-140" r="60" fill="#2a3240"/><circle cy="-158" r="22" fill="#4a5466"/><path d="M-38,-110 Q0,-150 38,-110Z" fill="#4a5466"/>
 <text y="-40" text-anchor="middle" font-family="Inter" font-weight="800" font-size="34" fill="#e8eef6">Номер скрыт</text>
 <text y="0" text-anchor="middle" font-family="Inter" font-size="22" fill="#8a94a6">входящий вызов…</text>
 <circle cx="-80" cy="200" r="44" fill="#d03030"/><circle cx="80" cy="200" r="44" fill="#30b050"/></g>`;}
function blackHands(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="-90" cy="0" r="30" fill="#1a1110"/><circle cx="90" cy="0" r="30" fill="#1a1110"/><circle cx="-84" cy="-6" r="10" fill="#ff5a1a" opacity=".5"/><circle cx="96" cy="4" r="8" fill="#ff5a1a" opacity=".5"/></g>`;}
function bloodGlasses(x,y,s=1,t=0,glassesBroken){return `${glassesBroken(x,y,s,t)}<g transform="translate(${x},${y}) scale(${s})"><path d="M60,-40 q40,10 50,40 q-5,20 -20,10 q-10,-20 -30,-25Z" fill="#8a1010" opacity=".9"/><circle cx="150" cy="30" r="8" fill="#8a1010"/><circle cx="-160" cy="20" r="6" fill="#8a1010"/></g>`;}
function timerHUD(t,tEnd){const left=Math.max(0,4*3600*(1-Math.pow(t/tEnd,1.6)));const h=Math.floor(left/3600),m=Math.floor(left/60)%60,sc=Math.floor(left)%60;
 const red=t/tEnd>.55;const pulse=red?(.7+.3*Math.sin(t*10)):1;
 return `<g font-family="Inter" text-anchor="middle" opacity="${pulse}"><rect x="340" y="236" width="400" height="104" rx="18" fill="#000" opacity=".55"/>
 <text x="540" y="272" font-size="24" font-weight="700" fill="${red?'#ff6a5a':'#9fd8c8'}" letter-spacing="6">ДО РАССВЕТА</text>
 <text x="540" y="326" font-size="52" font-weight="900" fill="${red?'#ff3030':'#e8fff6'}">${h}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}</text></g>`;}
module.exports={palm,phoneCall,blackHands,bloodGlasses,timerHUD};
