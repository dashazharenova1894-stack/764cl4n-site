/* кнопка «Установить приложение» в панели «Ещё» */
(function(){if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)return;var P;
addEventListener('beforeinstallprompt',function(e){e.preventDefault();P=e});
function add(){var p=document.getElementById('mrp');if(!p||p.querySelector('.ins'))return;
var b=document.createElement('button');b.type='button';b.className='ins';b.textContent='📲 Установить приложение';
var h=document.createElement('div');h.className='insh';h.hidden=true;
b.onclick=function(){if(P){P.prompt();P.userChoice.then(function(){P=null;b.remove();h.remove()})}
else{h.textContent=/iPad|iPhone|iPod/.test(navigator.userAgent)?'Safari: «Поделиться» → «На экран Домой».':'Меню браузера «⋮» → «Установить приложение» или «Добавить на главный экран».';h.hidden=!h.hidden}};
p.appendChild(b);p.appendChild(h)}
if(document.readyState!=='loading')add();else addEventListener('DOMContentLoaded',add);setTimeout(add,500)})();
