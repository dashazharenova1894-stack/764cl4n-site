/* установка как приложение (PWA): Edge/Chrome на ПК и Chrome на Android; ничего скачивать не нужно */
(function(){var p=document.getElementById('pwa'),h=document.getElementById('pwah'),sec=document.getElementById('app'),P=null;
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone){if(sec)sec.hidden=true;return}
addEventListener('beforeinstallprompt',function(e){e.preventDefault();P=e});
addEventListener('appinstalled',function(){P=null;if(p)p.hidden=true;if(h)h.textContent='Готово! Приложение установлено, ищи его в меню «Пуск».'});
if(p)p.onclick=function(){
 if(P){P.prompt();P.userChoice.then(function(){P=null});return}
 var m=location.protocol==='file:'?'Сайт открыт как файл с компьютера: так установка не работает. Открой сайт по его адресу (https://…) в Edge или Chrome и нажми кнопку там.'
  :/iPhone|iPad|iPod/i.test(navigator.userAgent)?'Safari: «Поделиться» → «На экран Домой».'
  :'Браузер пока не предлагает установку. Подожди пару секунд на странице или открой меню «⋯» (Edge) / «⋮» (Chrome) → «Приложения» → «Установить этот сайт как приложение». Если пункта нет, приложение уже установлено или браузер (например, Firefox) не умеет.';
 if(h){h.textContent=m;h.scrollIntoView({block:'nearest'})}}})();
(function(){
var REPO='';/* ВПИШИ: 'логин/репозиторий' (см. app/README.md). Пока пусто, скачивается старый лоадер .bat */
var FILE='764CL4N-Loader.exe',BAT='764CL4N-Loader.bat';
var a=document.getElementById('dl'),w=document.getElementById('dlw');if(!a)return;
if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){a.hidden=true;var h=document.getElementById('dlm');if(h)h.hidden=false;return}
var b=document.getElementById('dlb'),s=document.getElementById('dls'),busy=0;
function bar(p,t){b.style.width=p+'%';if(t!=null)s.textContent=t}
function save(u,name){var x=document.createElement('a');x.href=u;if(name)x.download=name;x.rel='noopener';document.body.appendChild(x);x.click();x.remove()}
function done(t){bar(100,t);a.classList.remove('busy');busy=0}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function latest(){var c=new AbortController(),t=setTimeout(function(){c.abort()},6000);
 return fetch('https://api.github.com/repos/'+REPO+'/releases/latest',{signal:c.signal,headers:{Accept:'application/vnd.github+json'}}).then(function(r){clearTimeout(t);if(!r.ok)throw 0;return r.json()})}
a.addEventListener('click',function(e){e.preventDefault();if(busy)return;busy=1;w.hidden=false;a.classList.add('busy');
 if(!REPO&&/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){bar(30,'Тест: ищем '+FILE+' рядом с сайтом…');fetch(FILE,{method:'HEAD'}).then(function(r){if(!r.ok)throw 0;return wait(500).then(function(){save(FILE,FILE);done('Тест: файл '+FILE+' скачан.')})}).catch(function(){save(BAT,BAT);done('Тест: '+FILE+' не найден, скачан старый '+BAT+'.')});return}
 if(!REPO){bar(40,'Подготовка…');wait(600).then(function(){save(BAT,BAT);done('Готово! Файл в папке «Загрузки». Запусти его, и ярлык появится на рабочем столе.')});return}
 bar(15,'Проверяем последнюю версию…');
 latest().then(function(j){var f=(j.assets||[]).filter(function(x){return/\.exe$/i.test(x.name)})[0];if(!f)throw 0;
  bar(60,'Версия '+(j.tag_name||'')+' · '+(f.size/1048576).toFixed(0)+' МБ. Начинаем загрузку…');return wait(700).then(function(){save(f.browser_download_url);done('Загрузка началась: прогресс виден в «Загрузки» браузера. Потом запусти '+f.name+'.')})})
 .catch(function(){bar(60,'Начинаем загрузку…');return wait(600).then(function(){save('https://github.com/'+REPO+'/releases/latest/download/'+FILE);done('Загрузка началась: смотри «Загрузки» браузера. Потом запусти '+FILE+'.')})})});
})();
