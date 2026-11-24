const fs=require('fs');const {chromium}=require('playwright');
const A=require('../episode1/art.js'),B=require('./../episode2/art2.js'),C=require('./art3.js');
const box=(vb,inner,label)=>`<div class="p"><svg viewBox="${vb}">${A.defs()}${inner}</svg><p>${label}</p></div>`;
const cell=(inner,label)=>`<div class="c"><svg viewBox="0 0 1080 1920">${A.defs()}${inner}</svg><p>${label}</p></div>`;
const sleeping=`<g transform="translate(330,1640) rotate(-90)">${A.stranger({shard:30})}</g>`;
const html=`<html><body style="margin:0;background:#06080d;color:#e9e2d0;font-family:Inter,sans-serif;width:2160px;padding:40px;box-sizing:border-box">
<style>.row{display:flex;gap:24px;margin-bottom:30px}.p{flex:1;background:#121826;border-radius:16px;text-align:center}.p svg{width:100%;height:340px}.c{flex:1}.c svg{width:100%;border-radius:14px}p{font-size:28px;margin:10px 0 16px}h1{font-size:52px;margin:0 0 20px;color:#ff9a4a}h2{font-size:34px;color:#6dffd2;margin:10px 0}</style>
<h1>ПАДЕНИЕ МЕТЕОРИТА · Серия 3 «Доза» — новое в серии</h1>
<h2>Новые предметы</h2><div class="row">
${box('-200 -330 400 380',C.campfire(0,0,1.1,1),'Ночной костёр')}${box('-200 -520 400 560',C.shadowThief(0,0,1,.6),'Тень с щипцами')}${box('-500 -760 560 820',C.fallingShard(0,0,1),'Падающий осколок')}${box('-120 -230 240 300',C.smallShard(0,0,2,1),'Тёплый осколок в росе')}</div>
<div class="row">${box('-180 -340 360 680',C.phoneSparks(0,0,1,1),'Телефон: белые искры')}${box('-200 -200 400 300',C.leadBox(0,0,1),'Свинцовый ящик')}${box('-150 -190 300 340',C.dosimeter(0,0,1,.85),'Дозиметр')}${box('-140 -140 280 280',C.radSign(0,0,1),'Знак радиации')}</div>
<div class="row">${box('-150 -160 300 220',C.bills(0,-40,1,1),'Три тысячи')}${box('-80 -150 160 200',C.gloves(0,20,1),'Перчатки скупщика')}${box('-320 -280 640 600',C.burnChest(0,0,1),'Ожог в форме осколка')}${box('-170 -640 340 680',A.stranger({blank:false}),'Молчун: ясный взгляд')}</div>
<h2>Локации</h2><div class="row">
${cell(`${A.bgStream()}<rect width="1080" height="1920" fill="#000" opacity=".45"/>${C.campfire(780,1640,1,1)}${sleeping}`,'Ночёвка за ручьём')}
${cell(`${A.bgForest(121)}<rect width="1080" height="1920" fill="#000" opacity=".5"/>${C.campfire(300,1700,.8,1,.25)}${C.shadowThief(640,1720,1.3,.8)}`,'Тень у погасшего костра')}
${cell(C.bgDawn(),'Рассвет в тумане')}${cell(`${B.bgTent()}${B.tent(540,1600,1.3,1)}`,'Палатка (из серии 2)')}</div></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2160,height:1400}});await p.setContent(html);await p.screenshot({path:process.argv[2],fullPage:true});await b.close();})();
