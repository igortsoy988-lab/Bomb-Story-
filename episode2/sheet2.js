const A=require('../episode1/art.js'),B=require('./art2.js');const {chromium}=require('playwright');
const box=(vb,inner,label)=>`<div class="p"><svg viewBox="${vb}">${A.defs()}${inner}</svg><p>${label}</p></div>`;
const cell=(bg,inner,label)=>`<div class="c"><svg viewBox="0 0 1080 1920">${A.defs()}${bg}${inner||''}</svg><p>${label}</p></div>`;
const html=`<html><body style="margin:0;background:#06080d;color:#e9e2d0;font-family:Inter,sans-serif;width:2160px;padding:40px;box-sizing:border-box">
<style>.row{display:flex;gap:24px;margin-bottom:30px}.p{flex:1;background:#121826;border-radius:16px;text-align:center}.p svg{width:100%;height:340px}.c{flex:1}.c svg{width:100%;border-radius:14px}p{font-size:28px;margin:10px 0 16px}h1{font-size:52px;margin:0 0 20px;color:#ff9a4a}h2{font-size:34px;color:#6dffd2;margin:10px 0}</style>
<h1>ПАДЕНИЕ МЕТЕОРИТА · Серия 2 — новое в серии</h1>
<h2>Герои — без изменений (из серии 1)</h2><div class="row">
${box('-170 -640 340 680',A.nikita(),'Никита')}${box('-170 -640 340 680',A.stranger({shard:34}),'Молчун (осколок под курткой)')}${box('-170 -640 340 680',A.buyer(),'Скупщик')}${box('-170 -640 340 680',A.hunter({color:'#5a3a2a'}),'Охотники')}</div>
<h2>Новые предметы</h2><div class="row">
${box('-120 -120 240 240',B.fakeShard(0,0,1.6),'Подделка: ровный свет')}${box('-120 -120 240 240',B.realShard(0,0,1.6,1),'Настоящий: пульсирует')}${box('-90 -70 180 140',B.brokenFake(0,0,1.4),'Разбитая подделка + маячок')}${box('-180 -180 360 360',B.compass(0,0,1,62),'Компас: стрелка на молчуна')}</div>
<div class="row">${box('-180 -340 360 680',B.phone(0,0,1),'Оповещение на телефоне')}${box('-360 -110 720 220',B.scope(60,0,1),'Армейский прицел с краской')}${box('-220 -340 440 400',B.kettle(0,0,1.4,1),'Чайник на углях')}${box('-100 -60 200 120',B.cash(0,0,1.4),'Деньги скупщика')}</div>
<h2>Новые локации</h2><div class="row">
${cell(B.bgFallen(),'','Поваленный лес в дыму')}${cell(B.bgTent(),B.tent(540,1560,1.2,1),'Палатка, полная осколков')}${cell(A.bgCliff(),'','Обрыв (из серии 1)')}${cell(A.bgStream(),'','Ручей (из серии 1)')}</div></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2160,height:1400}});await p.setContent(html);await p.screenshot({path:process.argv[2],fullPage:true});await b.close();})();
