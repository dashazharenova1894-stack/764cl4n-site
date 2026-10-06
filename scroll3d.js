/* 3D-эффект при прокрутке: разделы выезжают и уходят с наклоном, шапка уходит вглубь, звёзды двигаются слабее страницы */
(function(){
var R=document.documentElement,mq=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)');
if(mq&&mq.matches)return;
var secs=[],hero=null,heroW=null,stars=null,tick=false;
function collect(){
 secs=[].slice.call(document.querySelectorAll('section>.w'));
 hero=document.getElementById('hero');
 heroW=hero&&(hero.querySelector('.w')||hero.firstElementChild);
 stars=document.getElementById('stars');
}
function off(){return R.classList.contains('hx-phone')||R.classList.contains('hx10-lite')||innerWidth<700}
function cl(x){return x<0?0:x>1?1:x}
function ease(t){return 1-Math.pow(1-t,3)}
function reset(el){if(el&&el._s){el.style.transform='';el.style.opacity='';el.style.willChange='';el.style.transformOrigin='';el._s=0}}
function frame(){
 tick=false;
 var vh=innerHeight,y=window.pageYOffset||0;
 if(off()){secs.forEach(reset);reset(heroW);if(stars)stars.style.transform='';return}
 secs.forEach(function(el){
  if(el.offsetParent===null){reset(el);return}
  var r=el.getBoundingClientRect();
  if(r.bottom<-vh*.6||r.top>vh*1.2){reset(el);return}
  var e=ease(cl((vh-r.top)/(vh*.55))),l=cl((vh*.3-r.bottom)/(vh*.6));
  if(e>=.999&&l<=.001){reset(el);return}
  var rx,tz,op;
  if(l>0){rx=-l*16;tz=-l*160;op=1-l*.4;el.style.transformOrigin='50% 100%'}
  else{rx=(1-e)*24;tz=-(1-e)*220;op=.25+.75*e;el.style.transformOrigin='50% 0%'}
  el._s=1;el.style.willChange='transform,opacity';
  el.style.transform='perspective(1300px) translateZ('+tz.toFixed(1)+'px) rotateX('+rx.toFixed(2)+'deg)';
  el.style.opacity=op.toFixed(3);
 });
 if(heroW){
  var t=cl(y/(vh*.9));
  if(t<=.001)reset(heroW);
  else{heroW._s=1;heroW.style.willChange='transform,opacity';heroW.style.transformOrigin='50% 100%';
   heroW.style.transform='perspective(1200px) translate3d(0,'+(t*50).toFixed(1)+'px,'+(-t*220).toFixed(1)+'px) rotateX('+(t*14).toFixed(2)+'deg)';
   heroW.style.opacity=(1-t*.75).toFixed(3)}
 }
 if(stars)stars.style.transform=y>2?'translate3d(0,'+(-y*.05).toFixed(1)+'px,0) scale(1.1)':'';
}
function req(){if(!tick){tick=true;requestAnimationFrame(frame)}}
collect();
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
addEventListener('load',function(){collect();req();setTimeout(function(){collect();req()},2000)});
document.addEventListener('click',function(){setTimeout(req,500)});
req();
})();
