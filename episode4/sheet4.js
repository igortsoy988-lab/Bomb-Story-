const {chromium}=require('playwright');
const A=require('../episode1/art.js'),B=require('../episode2/art2.js'),C=require('../episode3/art3.js'),D=require('./art4.js');
const box=(vb,inner,label)=>`<div class="p"><svg viewBox="${vb}">${A.defs()}${inner}</svg><p>${label}</p></div>`;
const cell=(inner,label)=>`<div class="c"><svg viewBox="0 0 1080 1920">${A.defs()}${inner}</svg><p>${label}</p></div>`;
const carry=`<g>${A.stranger({blank:false,arm:165,arm2:-165})}<g transform="translate(280,-640) rotate(-90)">${A.nikita({arm:40,arm2:-40})}</g></g>`;
const html=`<html><body style="margin:0;background:#06080d;color:#e9e2d0;font-family:Inter,sans-serif;width:2160px;padding:40px;box-sizing:border-box">
<style>.row{display:flex;gap:24px;margin-bottom:30px}.p{flex:1;background:#121826;border-radius:16px;text-align:center}.p svg{width:100%;height:380px}.c{flex:1}.c svg{width:100%;border-radius:14px}p{font-size:28px;margin:10px 0 16px}h1{font-size:52px;margin:0 0 20px;color:#ff9a4a}h2{font-size:34px;color:#6dffd2;margin:10px 0}</style>
<h1>ПАДЕНИЕ МЕТЕОРИТА · Серия 4 «Чужая память» — новое в серии</h1>
<h2>Новые предметы и герои</h2><div class="row">
${box('-190 -130 380 260',D.pass(0,0,1),'Пропуск без фамилии')}${box('-360 -460 720 920',D.map(0,0,1,{k:1,hl:1}),'Карта: точки и «Я»')}${box('-360 -460 720 920',D.map(0,0,1,{k:4}),'Финал: «ЯДРО»')}${box('-170 -640 340 680',D.officer({salute:1}),'Офицер отдаёт честь')}</div>
<div class="row">${box('-420 -360 760 440',D.truck(0,0,1),'Военный грузовик')}${box('-420 -950 840 1000',carry,'Молчун несёт Никиту')}</div>
<h2>Локации</h2><div class="row">
${cell(D.bgRoad(),'Старая армейская бетонка')}${cell(`${D.bgRavineEdge()}${C.smallShard(540,1500,1.2,1,.2)}`,'Край оврага, внизу — камень')}${cell(D.memoryCase(1,B.fakeShard)+'<rect width="1080" height="1920" fill="#6dffd2" opacity=".12"/>','Воспоминание: чемодан стекла')}
${cell(`${C.bgDawn()}${D.truck(560,1500,1)}${'<g transform="translate(840,1560) scale(.7)">'+D.officer({salute:1})+'</g>'}`,'Опушка, грузовик')}</div></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2160,height:1400}});await p.setContent(html);await p.screenshot({path:process.argv[2],fullPage:true});await b.close();})();
