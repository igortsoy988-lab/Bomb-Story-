// node render.js timing.json out.mp4 [fps] [from] [to]  — рендер видеоряда (без звука)
const fs=require('fs'),{chromium}=require('playwright'),{spawn}=require('child_process');
const [timingF,out,fpsA,fromA,toA]=process.argv.slice(2);const fps=+(fpsA||30);
const T=JSON.parse(fs.readFileSync(timingF,'utf8'));const from=+(fromA||0),to=+(toA||T.end);
const html=`<html><body style="margin:0;background:#000"><div id="v"></div><script>const module={};${fs.readFileSync(__dirname+'/../episode1/art.js','utf8')};window.A=module.exports;</script><script>{const module={};const require=()=>window.A;${fs.readFileSync(__dirname+'/../episode2/art2.js','utf8')};window.B=module.exports;}{const module={};${fs.readFileSync(__dirname+'/art3.js','utf8')};window.C=module.exports;}window.TIMING=${JSON.stringify(T)};</script><script>${fs.readFileSync(__dirname+'/scenes.js','utf8')}</script></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});await p.setContent(html);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r',String(fps),out],{stdio:['pipe','inherit','inherit']});
 const n=Math.round((to-from)*fps);for(let f=0;f<n;f++){const t=from+f/fps;await p.evaluate(t=>{document.getElementById('v').innerHTML=draw(t)},t);
  const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(f%150==0)process.stdout.write(`${f}/${n}\n`);}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();})();
