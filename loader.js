/* лоадер: реальный прогресс (шрифты + загрузка страницы), плавное закрытие */
(function(){var t0=Date.now(),p=0,ready=0,go=0,fin=0,b,s;
function bar(v){p=Math.max(p,v);b=b||document.getElementById('ldb');if(b)b.style.width=p.toFixed(1)+'%'}
var iv=setInterval(function(){if(fin)return clearInterval(iv);
 var cap=go&&ready?100:90;bar(Math.min(cap,p+(cap-p)*.08+.4));
 if(go&&ready&&Date.now()-t0>1100&&p>=99.5){fin=1;clearInterval(iv);s=document.getElementById('lds');if(s)s.textContent='Готово';
  setTimeout(function(){window.__ldDone&&window.__ldDone()},280)}},60);
function rd(){ready=1}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){document.readyState==='complete'?rd():addEventListener('load',rd)});
setTimeout(rd,4500);
window.__ldGo=function(){go=1};
})();
