const A=require('./art.js');const {chromium}=require('playwright');
const W=1080,H=1920;
const cell=(bg,inner,label)=>`<div class="c"><svg viewBox="0 0 1080 1920">${A.defs()}${bg}${inner||''}</svg><p>${label}</p></div>`;
const ch=(fn,label,o)=>`<div class="p"><svg viewBox="-170 -640 340 680">${A.defs()}<ellipse cx="0" cy="8" rx="110" ry="14" fill="#000" opacity=".5"/>${fn(o)}</svg><p>${label}</p></div>`;
const html=`<html><body style="margin:0;background:#06080d;color:#e9e2d0;font-family:sans-serif;width:2160px;padding:40px;box-sizing:border-box">
<style>.row{display:flex;gap:24px;margin-bottom:30px}.p{flex:1;background:#121826;border-radius:16px;text-align:center}.p svg{width:100%;height:520px}.c{flex:1}.c svg{width:100%;border-radius:14px}p{font-size:30px;margin:10px 0 16px}h1{font-size:56px;margin:0 0 24px;color:#ff9a4a}h2{font-size:36px;color:#6dffd2;margin:10px 0}</style>
<h1>ПАДЕНИЕ МЕТЕОРИТА · Серия 1 «Кто первый» — лист персонажей и фонов</h1>
<h2>Персонажи</h2><div class="row">
${ch(A.nikita,'Никита, 69 — рассказчик')}${ch(A.stranger,'Молчун (куртка без нашивок)',{hold:true})}${ch(A.hunter,'Охотник 1',{color:'#5a3a2a'})}${ch(A.hunter,'Охотник 2',{color:'#2f4058',arm:-60})}${ch(A.soldier,'Солдат')}${ch(A.buyer,'Скупщик')}
</div><h2>Локации</h2><div class="row">
${cell(A.bgVillage(),'','Посёлок и зарево')}${cell(A.bgCrater(),'','Воронка')}${cell(A.bgForest(),'','Ночной лес')}${cell(A.bgStream(),'','Ручей с мёртвой рыбой')}${cell(A.bgCliff(),'','Обрыв и джип скупщика')}
</div></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2160,height:1400}});await p.setContent(html);await p.screenshot({path:process.argv[2],fullPage:true});await b.close();})();
