/* Блоки сообщества: онлайн, благодарности, вызовы, аналитика, игровые разделы, монетизация, кабинет, Q&A. Грузится в конце body. */
(function(){
var SOC=window.SOC_URL||'';/* пусто = локальный режим без сервера */
var HB=30000,IDLE=6e5;/* пульс 30 с; через 10 мин без действий пульс останавливается */
function $(i){return document.getElementById(i)}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var vid=ls('soc_vid');if(!vid){vid=Math.random().toString(36).slice(2,12)+Date.now().toString(36).slice(-4);ls('soc_vid',vid)}
function nick(){return(ls('gnick')||'').slice(0,16)}
function slug(n){return String(n||'').toLowerCase().replace(/[^a-z0-9._-]/g,'')}
function post(path,o,beacon){var b=JSON.stringify(o);
  if(beacon&&navigator.sendBeacon){try{return navigator.sendBeacon(SOC+path,b)}catch(e){}}
  return fetch(SOC+path,{method:'POST',body:b,keepalive:true,headers:{'Content-Type':'text/plain'}}).then(function(r){return r.json()})}
function get(path){return fetch(SOC+path).then(function(r){return r.json()})}
function col(n){var h=0;for(var i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%360;return'hsl('+h+',55%,45%)'}
/* ---------- ?ref= : засчитываем один раз на посетителя ---------- */
var q=new URLSearchParams(location.search).get('ref'),rc=slug(q);
if(rc&&!ls('soc_refby')&&rc!==slug(nick())){ls('soc_refby',rc);if(SOC)post('/ref',{code:rc,vid:vid}).catch(function(){})}
/* ---------- Who's Online ---------- */
var last=Date.now(),timer=null;
['pointerdown','keydown','scroll','touchstart'].forEach(function(e){addEventListener(e,function(){var was=Date.now()-last>IDLE;last=Date.now();if(was)start()},{passive:true})});
function drawOn(c,names){var n=$('soc-n'),a=$('soc-a');if(!n)return;
  var m=c%10,h=c%100;n.textContent='Сейчас на сайте: '+c+' '+(m===1&&h!==11?'человек':(m>=2&&m<=4&&(h<12||h>14)?'человека':'человек'));
  var os=document.getElementById('onsite');if(os){os.classList.remove('sk');os.textContent=c}
  a.innerHTML=names.map(function(x){return'<i style="background:'+col(x)+'" title="'+esc(x)+'">'+esc(x.charAt(0).toUpperCase())+'</i>'}).join('')+(c>names.length?'<i style="background:var(--bd)" title="Без ника">+'+(c-names.length)+'</i>':'')}
function beat(){if(document.hidden||Date.now()-last>IDLE)return stop();
  if(!SOC){drawOn(1,nick()?[nick()]:[]);return}
  post('/hb',{id:vid,n:nick()}).then(function(r){drawOn(r.count,r.names||[])}).catch(function(){})}
function start(){if(timer)return;beat();timer=setInterval(beat,HB)}
function stop(){clearInterval(timer);timer=null}
document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
addEventListener('pagehide',function(){stop();if(SOC)post('/leave',{id:vid},true)});
/* ---------- Kudos ---------- */
function kRender(a){var k=$('soc-k');if(!k)return;
  k.innerHTML=a.length?a.map(function(r){return'<div><b>'+esc(r.f)+'</b> → <b>'+esc(r.t)+'</b>: '+esc(r.x)+(SOC?' <button type="button" data-rp="'+r.id+'" title="Пожаловаться" aria-label="Пожаловаться" style="background:none;border:0;cursor:pointer;color:var(--mu)">⚑</button>':'')+'<small>'+new Date(r.ts).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+'</small></div>'}).join(''):'<small>Пока пусто. Будь первым.</small>'}
function kLoad(){if(SOC)get('/kudos').then(kRender).catch(function(){});else{var a=[];try{a=JSON.parse(ls('soc_k')||'[]')}catch(e){}kRender(a)}}
var KK=$('soc-k');if(KK)KK.addEventListener('click',function(e){var b=e.target.closest('button[data-rp]');if(!b)return;post('/kudos/report',{id:+b.dataset.rp,vid:vid}).then(function(){b.textContent='✓';b.disabled=true}).catch(function(){})});
var F=$('soc-f');if(F)F.addEventListener('submit',function(e){e.preventDefault();var m=$('soc-m'),f=nick(),t=$('soc-t').value.trim(),x=$('soc-x').value.trim();
  if(!f){f=(prompt('Твой ник (2–16 символов)','')||'').trim().slice(0,16);if(f.length<2){m.textContent='Нужен ник.';return}ls('gnick',f);refUI()}
  if(f.toLowerCase()===t.toLowerCase()){m.textContent='Себя благодарить нельзя :)';return}
  function ok(){$('soc-x').value='';m.textContent='Отправлено.';kLoad()}
  if(!SOC){var a=[];try{a=JSON.parse(ls('soc_k')||'[]')}catch(er){}a.unshift({f:f,t:t,x:x,ts:Date.now()});ls('soc_k',JSON.stringify(a.slice(0,30)));ok();return}
  post('/kudos',{f:f,t:t,x:x,vid:vid}).then(function(r){r.ok?ok():m.textContent=r.e==='limit'?'Лимит: 5 в час.':'Проверь поля.'}).catch(function(){m.textContent='Сервер недоступен.'})});
if(window.SITE&&SITE.ready)SITE.ready.then(function(d){var l=$('soc-l');if(l&&d&&d.members)l.innerHTML=d.members.map(function(m){return'<option value="'+esc(m.n)+'">'}).join('')});
/* ---------- Рефералы ---------- */
function link(){var c=slug(nick());return c?location.origin+location.pathname+'?ref='+c:''}
function refCount(cb){var c=slug(nick());if(!c)return cb(null);if(!SOC)return cb(0);get('/ref?code='+encodeURIComponent(c)).then(function(r){cb(r.n)}).catch(function(){cb(null)})}
function refUI(){var i=$('soc-r'),n=$('soc-rn'),l=link();if(!i)return;i.value=l||'Укажи ник в благодарностях или в профиле';
  refCount(function(c){n.textContent=c==null?'':'Приглашено: '+c+(SOC?'':' (счётчик заработает после подключения сервера)')})}
var C=$('soc-c');if(C)C.onclick=function(){var l=link();if(!l)return;navigator.clipboard&&navigator.clipboard.writeText(l).then(function(){C.textContent='Скопировано'; setTimeout(function(){C.textContent='Копировать'},1800)})};
/* блок в профиле: вставляется после каждой перерисовки окна */
function inProfile(){var M=$('x4m');if(!M||M.querySelector('.sref'))return;var d=document.createElement('div');d.className='sref';
  var l=link();d.innerHTML='<h4>Приглашения</h4>'+(l?'<input readonly value="'+esc(l)+'"><small class="socn">Приглашено: <b class="sn">…</b></small>':'<small class="socn">Укажи ник в разделе «Комьюнити», чтобы получить ссылку.</small>');
  var bx=M.querySelector('.bx')||M;bx.appendChild(d);var s=d.querySelector('.sn');if(s)refCount(function(c){s.textContent=c==null?'?':c})}
var M=$('x4m');if(M){new MutationObserver(inProfile).observe(M,{childList:true})}
refUI();kLoad();start();
})();
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
/* Значения по умолчанию. Свои задаются в data.json: "bounties":[...] и "hof":[...] */
var B=[
{t:'Первый набьёт 100 хедшотов в матчах клана',prize:'Роль «Снайпер» + 500 ◈',end:'2026-10-31T23:59:00',win:''},
{t:'Серия из 10 побед подряд',prize:'Кастомный тайтл в профиле',end:'2026-11-15T23:59:00',win:''},
{t:'Хедшот через две стены',prize:'Мерч клана',end:'2026-09-30T23:59:00',win:'wassupxyilo'}];
var H=[
{e:'🏆',t:'Апстрик года',n:'3b4rtb0eymamb',y:'2026',d:'Серия, о которой до сих пор шепчутся в Discord.'},
{e:'🎯',t:'Самый стабильный резолвер',n:'wassupxyilo',y:'2026',d:'Ни одного промаха по дедам в патче. Говорят.'},
{e:'🛡️',t:'Хранитель порядка',n:'xx444.z_83520',y:'2026',d:'Разрулил больше споров, чем сыграл матчей.'}];
function p2(n){return n<10?'0'+n:n}
function left(ms){var s=Math.floor(ms/1e3),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return(d?d+'д ':'')+p2(h)+':'+p2(m)+':'+p2(s%60)}
function st(b){return b.win?['c','Закрыт']:(new Date(b.end)<=Date.now()?['x','Истёк']:['o','Открыт'])}
function draw(){var t=$('bnb');if(!t)return;t.innerHTML=B.map(function(b,i){var s=st(b);
 var c=b.win?'Победил <b>'+esc(b.win)+'</b>':s[0]==='x'?'—':'<span class="bnm" data-i="'+i+'">'+left(new Date(b.end)-Date.now())+'</span>';
 return'<tr><td>'+esc(b.t)+'</td><td>'+esc(b.prize)+'</td><td><span class="bns '+s[0]+'">'+s[1]+'</span></td><td>'+c+'</td></tr>'}).join('')}
function tick(){if(document.hidden)return;var els=document.querySelectorAll('.bnm');for(var i=0;i<els.length;i++){var b=B[els[i].dataset.i],ms=new Date(b.end)-Date.now();if(ms<=0){draw();return}els[i].textContent=left(ms)}}
function hof(){var g=$('hfg');if(g)g.innerHTML=H.map(function(h){return'<div class="hfc"><em>'+esc(h.e||'🏅')+'</em><h3>'+esc(h.t)+'</h3><b>'+esc(h.n)+'</b> · '+esc(h.y)+'<small>'+esc(h.d)+'</small></div>'}).join('')}
draw();hof();setInterval(tick,1000);
fetch('data.json?'+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){
 if(d.bounties&&d.bounties.length){B=d.bounties;draw()}
 if(d.hof&&d.hof.length){H=d.hof;hof()}}).catch(function(){});
})();
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}return null}
function bar(l,v,max,t){var p=Math.max(0,Math.min(100,v/max*100));return'<div class="pbr"><div><span>'+esc(l)+'</span><b>'+esc(t==null?v:t)+'</b></div><u><i style="width:'+p+'%"></i></u></div>'}
function chart(el,vals,labs){var W=320,H=140,n=vals.length,mx=Math.max.apply(null,vals.concat([1])),bw=W/n,o='<svg viewBox="0 0 '+W+' '+(H+18)+'" role="img">';
 vals.forEach(function(v,i){var h=v/mx*H;o+='<rect x="'+(i*bw+bw*.15)+'" y="'+(H-h)+'" width="'+bw*.7+'" height="'+h+'" rx="3"><title>'+esc(labs[i])+': '+v+'</title></rect>';if(n<=12||i%3===0)o+='<text x="'+(i*bw+bw/2)+'" y="'+(H+13)+'">'+esc(labs[i])+'</text>'});
 el.innerHTML=o+'</svg>'}
/* ---------- XP за действия (через профиль x4) ---------- */
var XP={};try{XP=JSON.parse(ls('xp6')||'{}')}catch(e){}
function award(key,xp,coins,msg){var X=window.__x4;if(!X||XP[key])return;XP[key]=1;ls('xp6',JSON.stringify(XP));X.gain(xp,coins||0);X.sv();X.toast('+'+xp+' XP · '+msg)}
function day(){return new Date().toISOString().slice(0,10)}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){award('sec:'+e.target.id,5,0,'раздел «'+(e.target.querySelector('h2')||{textContent:e.target.id}).textContent+'»');io.unobserve(e.target)}})},{threshold:.4});
 document.querySelectorAll('section[id]').forEach(function(x){io.observe(x)})}
document.addEventListener('click',function(e){if(e.target.closest('#ppx button,#ppx .po'))award('poll',20,10,'голос в опросе')});
document.addEventListener('submit',function(e){var t=e.target;if(t.id==='soc-f')award('kudos:'+day(),10,5,'благодарность');if(t.closest&&t.closest('#apply'))award('apply',50,25,'заявка в клан')},true);
/* ---------- Моя статистика ---------- */
var P={};try{P=JSON.parse(ls('pst6')||'{}')}catch(e){}
function pDraw(){var b=$('ps-b'),h='';if(P.hs==null&&P.kd==null&&!P.m&&!P.s){b.innerHTML='<small class="an6n">Пока пусто. Заполни поля ниже.</small>';return}
 if(P.hs!=null)h+=bar('Headshot %',P.hs,100,P.hs+'%');if(P.kd!=null)h+=bar('K/D',P.kd,3,P.kd);if(P.m)h+=bar('Матчей',P.m,500);if(P.s)h+=bar('Среднее за сессию',P.s,180,P.s+' мин');
 if(P.mp&&P.mp.length)h+='<div style="margin-top:12px"><small class="an6n">Любимые карты</small><br>'+P.mp.map(function(m){return'<span class="chp">'+esc(m)+'</span>'}).join('')+'</div>';b.innerHTML=h}
function num(i,a,z){var v=parseFloat($(i).value);return isFinite(v)?Math.max(a,Math.min(z,v)):null}
$('ps-ok').onclick=function(){P={hs:num('ps-hs',0,100),kd:num('ps-kd',0,20),m:num('ps-m',0,1e5),s:num('ps-s',0,1440),mp:$('ps-mp').value.split(',').map(function(x){return x.trim().slice(0,20)}).filter(Boolean).slice(0,6)};ls('pst6',JSON.stringify(P));pDraw();award('stats',25,10,'заполнены статы')};
$('ps-x').onclick=function(){P={};ls('pst6',null);['hs','kd','m','s','mp'].forEach(function(k){$('ps-'+k).value=''});pDraw()};
['hs','kd','m','s'].forEach(function(k){if(P[k]!=null)$('ps-'+k).value=P[k]});if(P.mp)$('ps-mp').value=P.mp.join(', ');pDraw();
/* ---------- Графики ---------- */
var A={calls:[3,4,2,5,4,6,5,7],peak:[2,1,1,0,0,0,1,2,3,4,5,6,7,8,9,11,13,15,18,20,17,12,7,4]};
function dA(isDemo){chart($('g-c'),A.calls,A.calls.map(function(_,i){return'Н'+(i+1)}));
 chart($('g-p'),A.peak,A.peak.map(function(_,i){return i}));
 $('a-c').textContent=$('a-p').textContent=isDemo?'Демо-данные. Свои задаются в data.json (поле act).':''}
function growth(ms){var c={};ms.forEach(function(m){var k=(m.j||'').slice(0,7);if(k)c[k]=(c[k]||0)+1});var ks=Object.keys(c).sort(),t=0,v=[];ks.forEach(function(k){t+=c[k];v.push(t)});if(v.length)chart($('g-g'),v,ks.map(function(k){return k.slice(2)}));else $('g-g').innerHTML=''}
fetch('data.json?'+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){
 var a=d.act;if(a&&a.calls&&a.peak&&a.peak.length===24){A=a;dA(false)}else dA(true);growth(d.members||[])}).catch(function(){dA(true)});
/* ---------- Карточка участника #pm: вкладки ---------- */
function tabs(pm){var bx=pm.querySelector('.bx'),h=bx&&bx.querySelector('h3'),dl=bx&&bx.querySelector('dl');if(!h||!dl||bx.querySelector('.pt'))return;
 var D=window.SITE&&SITE.data;if(!D)return;var m=D.members.filter(function(x){return x.n===h.textContent})[0];if(!m)return;
 var hu=0;for(var i=0;i<m.n.length;i++)hu=(m.n.charCodeAt(i)+hu*31)%360;
 var av=document.createElement('div');av.className='pav';av.style.background='hsl('+hu+',55%,45%)';av.textContent=m.n.charAt(0).toUpperCase();bx.insertBefore(av,bx.firstChild);
 var st=String(m.st||''),g=function(r){var x=st.match(r);return x?parseFloat(x[1]):null},hs=g(/HS:\s*([\d.]+)/),kd=g(/K\/D:\s*([\d.]+)/),mt=g(/Матчей:\s*([\d.]+)/);
 var sh=(hs!=null?bar('Headshot %',hs,100,hs+'%'):'')+(kd!=null?bar('K/D',kd,3,kd):'')+(mt!=null?bar('Матчей',mt,500):'')||'<small class="an6n">Статы не заполнены.</small>';
 var cl=(D.clips||[]).filter(function(c){return c.p===m.n&&c.id}).map(function(c){return'<div><a href="https://youtu.be/'+esc(c.id)+'" target="_blank" rel="noopener">▶ '+esc(c.t)+'</a></div>'}).join('')||'<small class="an6n">Клипов пока нет.</small>';
 var ac=(m.t||[]).concat(m.ach||[]).map(function(x){return'<span class="chp">'+esc(x)+'</span>'}).join('')+(m.k!=null?'<div style="margin-top:10px" class="an6n">Уровень доступа: '+esc(m.k)+'</div>':'')||'<small class="an6n">Пока пусто.</small>';
 var P4=[['Профиль',null],['Статы',sh],['Клипы',cl],['Ачивки',ac]],bar2=document.createElement('div');bar2.className='pt';
 dl.className=(dl.className+' pp').trim();var ps=[dl];
 P4.slice(1).forEach(function(t){var d=document.createElement('div');d.className='pp';d.hidden=true;d.style.marginTop='16px';d.innerHTML=t[1];dl.parentNode.appendChild(d);ps.push(d)});
 P4.forEach(function(t,i){var b=document.createElement('button');b.type='button';b.textContent=t[0];if(!i)b.className='on';b.onclick=function(){bar2.querySelectorAll('button').forEach(function(x,j){x.classList.toggle('on',j===i);ps[j].hidden=j!==i})};bar2.appendChild(b)});
 h.parentNode.insertBefore(bar2,dl)}
new MutationObserver(function(ms){ms.forEach(function(r){r.addedNodes.forEach(function(n){if(n.id==='pm')tabs(n)})})}).observe(document.body,{childList:true});
})();
(function(){var IDS=['roster','media','achievements','results','hof','bounty','act'],base=location.origin+location.pathname.replace(/[^\/]*$/,'');
IDS.forEach(function(id){var h=document.querySelector('#'+id+' .sh h2');if(!h)return;var b=document.createElement('button');b.type='button';b.textContent='🔗';b.title='Скопировать ссылку для шеринга';b.setAttribute('aria-label','Скопировать ссылку на раздел');b.style.cssText='background:none;border:0;cursor:pointer;font-size:.6em;margin-left:10px;opacity:.6';
 b.onclick=function(){var u=base+'share/'+id+'.html';(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){b.textContent='✓'}).catch(function(){prompt('Ссылка:',u)});setTimeout(function(){b.textContent='🔗'},1500)};h.appendChild(b)})})();
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}return null}
function fd(d){var x=new Date(d);return isNaN(x)?'':x.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}
var SU=window.SOC_URL||'';
/* ---- 1. видео-фон: положи hero.webm и/или hero.mp4 рядом с index.html ---- */
(function(){var h=$('hero'),c=navigator.connection||{};if(!h||matchMedia('(prefers-reduced-motion:reduce)').matches||c.saveData||innerWidth<700)return;
 var v=document.createElement('video');v.className='hv';v.muted=true;v.loop=true;v.playsInline=true;v.autoplay=true;v.setAttribute('aria-hidden','true');v.preload='metadata';
 ['webm:video/webm','mp4:video/mp4'].forEach(function(x){var t=x.split(':'),e=document.createElement('source');e.src='hero.'+t[0];e.type=t[1];v.appendChild(e)});
 v.lastChild.addEventListener('error',function(){v.remove()});v.addEventListener('canplay',function(){v.classList.add('on')});h.insertBefore(v,h.firstChild);
 new IntersectionObserver(function(es){es[0].isIntersecting&&!document.hidden?v.play().catch(function(){}):v.pause()}).observe(h);
 document.addEventListener('visibilitychange',function(){document.hidden&&v.pause()})})();
/* ---- данные: news / plan / places можно задать в data.json ---- */
var NW=[{d:'2026-10-03',a:'3b4rtb0eymamb',t:'Новый сайт клана',x:'Добавили онлайн, вызовы, доску почёта и профили.'},{d:'2026-09-28',a:'wassupxyilo',t:'Набор в состав открыт',x:'Заявки принимаем в Discord, канал #applications.'}];
var PL=[{ic:'🎬',t:'Хайлайт-монтаж',d:'2026-10-20',x:'Лучшие моменты последних матчей клана.'},{ic:'🏆',t:'Итоги командного турнира',d:'2026-10-25',x:'Разбор игр и клипы с места событий.'},{ic:'🎙️',t:'Подкаст «Резолвер дня»',d:'2026-11-05',x:'Первый выпуск: как мы готовимся к скримам.'}];
function news(){$('nws').innerHTML=NW.slice().sort(function(a,b){return a.d<b.d?1:-1}).slice(0,6).map(function(n){return'<div class="uxc"><small>'+esc(fd(n.d))+' · '+esc(n.a)+'</small><h3>'+esc(n.t)+'</h3><p>'+esc(n.x)+'</p></div>'}).join('')}
function plan(){$('pln').innerHTML=PL.map(function(n){var dd=Math.ceil((new Date(n.d)-Date.now())/864e5);return'<div class="uxc"><em>'+esc(n.ic||'🗓️')+'</em><h3>'+esc(n.t)+'</h3><small>'+esc(fd(n.d))+(dd>0?' · через '+dd+' дн.':'')+'</small><p>'+esc(n.x)+'</p></div>'}).join('')}
/* заменяем пустые «Скоро...» в медиа на тизеры */
function soon(){var m=$('media');if(!m)return;var w=document.createTreeWalker(m,NodeFilter.SHOW_TEXT),n,i=0,a=[];while(n=w.nextNode())if(n.nodeValue.trim()==='Скоро...')a.push(n);
 a.forEach(function(t){var x=PL[i++%PL.length];t.nodeValue='Скоро · '+x.t+' · '+fd(x.d)})}
/* ---- конфиг-билдер ---- */
var CS={agg:{y:'Jitter, диапазон 70–90°',f:'Fake lag: 14, Adaptive',dt:'Double tap: Defensive, всегда',hc:'Hitchance: 55',md:'Min damage: 25 (override 1)'},stb:{y:'Static + Delay jitter, 40–58°',f:'Fake lag: 8, Maximum',dt:'Double tap: Offensive, по условию',hc:'Hitchance: 70',md:'Min damage: 40 (override 1)'},hyb:{y:'Jitter 55–70°, смена по ситуации',f:'Fake lag: 11, Dynamic',dt:'Double tap: Defensive при пике',hc:'Hitchance: 62',md:'Min damage: 32 (override 1)'}};
var RO={e:'Entry: быстрый пик, приоритет на голову',a:'Опора: держи угол, меньше движений',l:'Лёрк: тихая позиция, body-aim на первом выстреле'};
function cfg(){var c=CS[$('cf-s').value],m=$('cf-m').value;
 $('cfo').textContent=['# '+$('cf-c').value+' · '+$('cf-s').selectedOptions[0].textContent+' · '+m,'# '+RO[$('cf-r').value],'','Anti-aim: '+c.y,c.f,c.dt,c.hc,c.md,'Body aim: если HP < 50 или нет резольва','Safe point: на конечностях'].join('\n')}
['cf-s','cf-m','cf-r','cf-c'].forEach(function(i){$(i).onchange=cfg});cfg();
$('cf-cp').onclick=function(){var b=this;navigator.clipboard&&navigator.clipboard.writeText($('cfo').textContent).then(function(){b.textContent='Скопировано';setTimeout(function(){b.textContent='Копировать'},1600)})};
/* ---- статусы участников (только по личному ключу) ---- */
var SL={team:'В тимспике',scrim:'На скриме',afk:'AFK'},ST={};
function stDots(){var r=$('ros');if(!r)return;[].forEach.call(r.querySelectorAll('.sdt'),function(x){x.remove()});
 var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT),n,L=[];while(n=w.nextNode())if(ST[n.nodeValue.trim()])L.push(n);
 L.forEach(function(t){var d=document.createElement('i');d.className='sdt '+ST[t.nodeValue.trim()];d.title=SL[ST[t.nodeValue.trim()]];t.parentNode.insertBefore(d,t.nextSibling)})}
function stLoad(){var k=ls('mkey');if(!SU||!k)return;fetch(SU+'/st?k='+encodeURIComponent(k)).then(function(r){return r.ok?r.json():Promise.reject()}).then(function(j){ST=j.st;$('mkb').hidden=false;$('mkm').textContent='Ты вошёл как '+j.me;
  $('mkl').innerHTML=Object.keys(ST).map(function(n){return'<span><b>'+esc(n)+'</b> <i class="sdt '+ST[n]+'"></i> '+SL[ST[n]]+'</span>'}).join('')||'<span>Сейчас никто не отметился.</span>';stDots()}).catch(function(){$('mkm').textContent='Ключ не подошёл или сервер недоступен.';ls('mkey',null)})}
$('mko').onclick=function(){ls('mkey',$('mk').value.trim());$('mk').value='';if(!SU)$('mkm').textContent='Сервер не подключён (window.SOC_URL).';stLoad()};
$('mkb').onclick=function(e){var b=e.target.closest('button[data-s]');if(!b)return;fetch(SU+'/st',{method:'POST',body:JSON.stringify({k:ls('mkey'),s:b.dataset.s})}).then(stLoad)};
if($('ros'))new MutationObserver(function(){if(Object.keys(ST).length)stDots()}).observe($('ros'),{childList:true,subtree:false});
/* ---- старт ---- */
function go(){news();plan();setTimeout(soon,400);stLoad()}
fetch('data.json?'+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){if(d.news&&d.news.length)NW=d.news;if(d.plan&&d.plan.length)PL=d.plan;}).catch(function(){}).then(go);
})();
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}return null}
var SU=window.SOC_URL||'',vid=ls('soc_vid')||'anon';
function nick(){return(ls('gnick')||'').slice(0,16)}
var CFG={};
/* ---- результаты с сервера (Discord-бот или Faceit-ретранслятор шлёт POST /results) ---- */
function results(){if(!SU||!$('rt'))return;fetch(SU+'/results').then(function(r){return r.json()}).then(function(a){if(!Array.isArray(a)||!a.length)return;
 $('rt').innerHTML=a.map(function(x){return'<tr><td>'+esc(x.t)+'</td><td>'+esc(x.d)+'</td><td>'+esc(x.r)+'</td></tr>'}).join('')}).catch(function(){})}
/* ---- стрим: data.json "stream":{"twitch":"канал","youtube":"ID канала"} ---- */
var live=null,mounted=false;
function player(){var c=CFG.stream||{},u=c.twitch?'https://player.twitch.tv/?channel='+encodeURIComponent(c.twitch)+'&parent='+location.hostname+'&muted=true':'https://www.youtube.com/embed/live_stream?channel='+encodeURIComponent(c.youtube)+'&mute=1';
 return'<div class="stf"><iframe src="'+u+'" allowfullscreen loading="lazy" title="Стрим клана"></iframe></div>'}
function stream(){var c=$('stc'),cf=CFG.stream;if(!c||!cf||(!cf.twitch&&!cf.youtube))return;
 var badge=live===true?'<span class="stl on">● В эфире</span>':live===false?'<span class="stl off">Офлайн</span>':'',
  links=(cf.twitch?'<a class="btn p" target="_blank" rel="noopener" href="https://twitch.tv/'+esc(cf.twitch)+'">Twitch</a> ':'')+(cf.youtube?'<a class="btn" target="_blank" rel="noopener" href="https://youtube.com/channel/'+esc(cf.youtube)+'">YouTube</a>':''),
  auto=live===true&&innerWidth>=700;
 if(mounted&&live!==false)return;
 c.innerHTML='<p>'+badge+' '+(live===false?'Сейчас эфира нет. Анонсы смотри в событиях и Discord.':'Смотри игры клана в прямом эфире.')+'</p>'+(auto?player():live===false?'':'<button class="btn p" id="stb" type="button" style="margin-top:8px">'+(innerWidth<700?'Смотреть (загрузит плеер)':'Загрузить плеер')+'</button>')+'<div style="margin-top:12px">'+links+'</div>';
 mounted=auto;var b=$('stb');if(b)b.onclick=function(){b.insertAdjacentHTML('afterend',player());b.remove();mounted=true}}
function poll(){if(document.hidden||!SU||!(CFG.stream&&CFG.stream.twitch))return;fetch(SU+'/live').then(function(r){return r.json()}).then(function(j){var n=!!j.live;if(n!==live){live=n;mounted=false;stream()}}).catch(function(){})}
/* ---- календарь на неделю + RSVP ---- */
var R={},mine={};try{mine=JSON.parse(ls('rsvp6')||'{}')}catch(e){}
function week(){var g=$('events');if(!g||!window.__EV)return;var w=$('wk');if(!w){w=document.createElement('div');w.id='wk';w.className='uxc';w.style.marginTop='18px';g.querySelector('.w').appendChild(w)}
 var days='';for(var i=0;i<7;i++){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+i);
  var ev=__EV.filter(function(e){var t=new Date(e.at+':00+03:00');return t.toDateString()===d.toDateString()}).map(function(e){var t=new Date(e.at+':00+03:00'),who=R[e.at]||[],on=!!mine[e.at];
   return'<div class="wke"><b>'+t.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})+'</b> '+esc(e.n)+'<button type="button" data-e="'+esc(e.at)+'" aria-pressed="'+on+'">'+(on?'Иду ✓':'Буду')+' · '+who.length+'</button>'+(who.length?'<small>Идут: '+who.slice(0,8).map(esc).join(', ')+'</small>':'')+'</div>'}).join('');
  days+='<div class="wkd'+(i?'':' td')+'"><b>'+d.toLocaleDateString('ru-RU',{weekday:'short',day:'numeric',month:'numeric'})+'</b>'+ev+'</div>'}
 w.innerHTML='<h3>Неделя вперёд</h3><small class="an6n">Время по твоему часовому поясу. Отметься, чтобы остальные видели, кто придёт.</small><div class="wkg">'+days+'</div>'}
document.addEventListener('click',function(e){var b=e.target.closest('#wk button[data-e]');if(!b)return;var id=b.dataset.e,n=nick();
 if(!n){n=(prompt('Твой ник (2–16 символов)','')||'').trim().slice(0,16);if(n.length<2)return;ls('gnick',n)}
 var on=!mine[id];mine[id]=on;if(!on)delete mine[id];ls('rsvp6',JSON.stringify(mine));
 var a=(R[id]||[]).filter(function(x){return x!==n});if(on)a.push(n);R[id]=a;week();
 if(SU)fetch(SU+'/rsvp',{method:'POST',body:JSON.stringify({ev:id,nick:n,on:on}),keepalive:true}).catch(function(){})});
function rsvpLoad(){if(!SU)return;fetch(SU+'/rsvp').then(function(r){return r.json()}).then(function(j){R=j||{};week()}).catch(function(){})}
/* ---- экономика ---- */
function eco(){var X=window.__x4;if(!X||!$('eb'))return;var S=X.S;
 $('eb').innerHTML='Уровень <b>'+X.lv(S.xp)+'</b> · '+X.rk(X.lv(S.xp))+'<br>Опыт: <b>'+S.xp+'</b> · Монеты: <b>'+S.coins+' ◈</b> · Серия входов: <b>'+S.streak+'</b>';
 var day=new Date().toISOString().slice(0,10),E={};try{E=JSON.parse(ls('eco6')||'{}')}catch(e){}
 var done=E.last===day;$('ed').disabled=done;$('em').textContent=done?'Бонус на сегодня уже получен.':'Бонус растёт с серией входов: до +50 ◈.';
 $('ed').onclick=function(){if(E.last===day)return;var b=15+Math.min(S.streak||0,7)*5;E.last=day;ls('eco6',JSON.stringify(E));X.gain(5,b);X.sv();X.toast('Ежедневный бонус: +'+b+' ◈');eco()};
 if(window.__CS)$('eo').innerHTML=__CS.map(function(c){var n=c[2].length,m={};c[2].forEach(function(o){var k=o[0]==='coins'?o[1]+' ◈':o[0]==='item'?'предмет':'значок';m[k]=(m[k]||0)+1});
  return'<table><tr><td colspan="2"><b>'+esc(c[0])+'</b> · '+c[1]+' ◈</td></tr>'+Object.keys(m).map(function(k){return'<tr><td>'+esc(k)+'</td><td>'+Math.round(m[k]/n*100)+'%</td></tr>'}).join('')+'</table>'}).join('')}
var H=[];try{H=JSON.parse(ls('eco6h')||'[]')}catch(e){}
function hist(){if(H.length)$('eh').innerHTML=H.map(function(x){return'<div style="font-size:13px;padding:4px 0;border-bottom:1px solid var(--bd)">'+esc(x)+'</div>'}).join('')}
var kr=$('x5kr');if(kr)new MutationObserver(function(){var t=kr.textContent;if(!t||/^(Крутится|Не хватает)/.test(t)||H[0]===t)return;H.unshift(t);H=H.slice(0,8);ls('eco6h',JSON.stringify(H));hist();eco()}).observe(kr,{childList:true,characterData:true,subtree:true});
hist();setTimeout(eco,300);
document.addEventListener('visibilitychange',function(){if(!document.hidden){poll();eco()}});
fetch('data.json?'+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){CFG=d}).catch(function(){}).then(function(){
 setTimeout(function(){results();stream()},600);week();rsvpLoad();poll();setInterval(poll,12e4);setInterval(function(){if(!document.hidden)results()},3e5)});
})();
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ok(u){return /^https?:\/\//.test(String(u||''))}
function img(u){return /^(https:\/\/|[\w\-\/.]+\.(png|jpe?g|webp|svg)$)/.test(String(u||''))}
fetch('data.json?'+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){
 var h='',P=(d.partners||[]).filter(function(x){return x&&x.n&&ok(x.u)}),D=d.donate||{},S=(d.sponsors||[]).filter(function(x){return x&&x.n&&ok(x.u)});
 P.forEach(function(x){h+='<div class="uxc"><small>Партнёрская ссылка</small><h3>'+esc(x.n)+'</h3><p>'+esc(x.d||'')+'</p><div class="mnb"><a class="btn p" href="'+esc(x.u)+'" target="_blank" rel="sponsored nofollow noopener">Перейти</a>'+(x.code?'<button class="btn" type="button" data-c="'+esc(x.code)+'">Промокод: '+esc(x.code)+'</button>':'')+'</div></div>'});
 if(ok(D.da)||ok(D.boosty)){var g=D.goal,pc=g&&g.max?Math.max(0,Math.min(100,g.cur/g.max*100)):0;
  h+='<div class="uxc"><h3>Поблагодарить</h3><p>'+esc(D.t||'Помоги клану с оборудованием и турнирами.')+'</p>'+(g&&g.max?'<small>'+esc(g.t||'Цель')+': '+esc(g.cur)+' / '+esc(g.max)+' '+esc(g.cur_u||'₽')+'</small><div class="mnp"><i style="width:'+pc+'%"></i></div>':'')+'<div class="mnb">'+(ok(D.da)?'<a class="btn p" href="'+esc(D.da)+'" target="_blank" rel="noopener">DonationAlerts</a>':'')+(ok(D.boosty)?'<a class="btn" href="'+esc(D.boosty)+'" target="_blank" rel="noopener">Boosty</a>':'')+'</div></div>'}
 if(h){$('sup').hidden=false;$('mng').innerHTML=h;$('mnd').hidden=!P.length}
 if(S.length){$('spn-s').hidden=false;var b=$('spn');b.innerHTML=S.map(function(x,i){return'<a href="'+esc(x.u)+'" target="_blank" rel="sponsored nofollow noopener" class="'+(i?'':'on')+'">'+(img(x.img)?'<img src="'+esc(x.img)+'" alt="'+esc(x.n)+'" loading="lazy">':'')+'<span>'+esc(x.t||x.n)+'</span></a>'}).join('')+'<small>Партнёр</small>';
  var as=b.querySelectorAll('a'),i=0,hv=false;b.onmouseenter=function(){hv=true};b.onmouseleave=function(){hv=false};
  if(as.length>1&&!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(function(){if(hv||document.hidden)return;as[i].classList.remove('on');i=(i+1)%as.length;as[i].classList.add('on')},8000)}
}).catch(function(){});
document.addEventListener('click',function(e){var b=e.target.closest('button[data-c]');if(!b)return;var t=b.textContent;navigator.clipboard&&navigator.clipboard.writeText(b.dataset.c).then(function(){b.textContent='Скопировано';setTimeout(function(){b.textContent=t},1600)})});
})();
(function(){
function $(i){return document.getElementById(i)}
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function bd(){var X=window.__x4,el=$('eco');if(!X||!el)return;var x={};try{x=JSON.parse(ls('xp6')||'{}')}catch(e){}var k=Object.keys(x),sec=k.filter(function(a){return a.indexOf('sec:')===0}).length,kd=k.filter(function(a){return a.indexOf('kudos:')===0}).length;
 var B=[['🧭','Исследователь',sec>=10,'Открыл 10 разделов'],['🔥','Постоянный',(X.S.streak||0)>=5,'5 дней подряд'],['🗳️','Избиратель',!!x.poll,'Проголосовал'],['🤝','Благодарный',kd>=3,'3 дня с благодарностями'],['📊','Статист',!!x.stats,'Заполнил статы'],['📨','Кандидат',!!x.apply,'Подал заявку'],['🔗','Рекрутер',!!ls('soc_ref_ok'),'Привёл друга']];
 var g=el.querySelector('.ecg'),c=$('bdg');if(!c){c=document.createElement('div');c.id='bdg';c.className='uxc';g.appendChild(c)}
 c.innerHTML='<h3>Значки</h3>'+B.map(function(b){return'<span class="chp" title="'+esc(b[3])+'" style="'+(b[2]?'':'opacity:.35')+'">'+b[0]+' '+b[1]+'</span>'}).join('')}
setTimeout(bd,500);document.addEventListener('click',function(){setTimeout(bd,400)});
/* ?p=ник : открыть карточку игрока (ссылки со страниц p/*.html) */
var n=new URLSearchParams(location.search).get('p');if(n&&window.SITE&&SITE.ready)SITE.ready.then(function(){setTimeout(function(){var r=$('ros');if(!r)return;var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode())if(t.nodeValue.trim()===n){var c=t.parentNode.closest('[data-i]')||t.parentNode.parentNode;c.click();$('roster').scrollIntoView();break}},800)});
})();
(function(){var P={"Комьюнити": "Community", "Кто сейчас на сайте, благодарности за пуш и твоя реферальная ссылка.": "Who is online, kudos for great plays and your referral link.", "Только те, кто указал ник. Остальные считаются без имени.": "Only people who set a nickname are shown. The rest are counted anonymously.", "Стена благодарностей": "Kudos wall", "Скажи спасибо за пуш на соревновании. Лимит: 5 сообщений в час.": "Say thanks for a great play. Limit: 5 messages per hour.", "Поблагодарить": "Say thanks", "Лента": "Feed", "Приглашай друзей": "Invite friends", "Вызовы": "Challenges", "Кто первый выполнит условие, тот забирает награду. Пиши в Discord, если успел.": "First to complete the goal takes the prize. Tell us in Discord if you made it.", "Вызов": "Challenge", "Награда": "Prize", "Статус": "Status", "Таймер / победитель": "Timer / winner", "Доска почёта": "Hall of Fame", "Легенды клана и мемные звания. Лор, который мы не забудем.": "Clan legends and meme titles. Lore we will not forget.", "Активность клана": "Clan activity", "Созвоны, пик онлайна и рост состава.": "Calls, peak online and roster growth.", "Созвонов в неделю": "Calls per week", "Пик онлайна по часам": "Peak online by hour", "Рост состава": "Roster growth", "По датам вступления участников.": "Based on member join dates.", "Моя статистика": "My stats", "Введи свои цифры, они хранятся только в твоём браузере.": "Enter your numbers. They are stored only in your browser.", "Сохранить": "Save", "Сбросить": "Reset", "Что нового": "What's new", "Новости и изменения в клане.": "Clan news and changes.", "Контент-план": "Content plan", "Что готовим и когда ждать.": "What we are preparing and when to expect it.", "Для своих": "Members only", "Статусы участников. Нужен личный ключ от админа клана.": "Member statuses. Requires a personal key from a clan admin.", "Войти": "Sign in", "В тимспике": "In TeamSpeak", "На скриме": "In a scrim", "Оффлайн": "Offline", "Конфиг-билдер": "Config builder", "Выбери стиль, карту и роль, получишь список настроек для ручного ввода в своём софте.": "Pick a style, map and role to get a list of settings to enter manually.", "Копировать": "Copy", "Экономика клана": "Clan economy", "Активность на сайте даёт опыт и монеты, монеты открывают кейсы.": "Activity on the site gives XP and coins; coins open cases.", "Кошелёк": "Wallet", "Ежедневный бонус": "Daily bonus", "Шансы кейсов": "Case odds", "Последние дропы": "Recent drops", "Поддержать клан": "Support the clan", "Донаты идут на оборудование, серверы и призы турниров.": "Donations go to equipment, servers and tournament prizes.", "Ближайшие события": "Upcoming events", "Скримы, турниры и сборы клана. Время показано по твоему часовому поясу.": "Scrims, tournaments and clan meetups. Times are shown in your time zone."};if(window.__D)for(var k in P)window.__D.push([k,P[k]]);
try{if(localStorage.getItem('lang')==='en'&&window.__tr)window.__tr()}catch(e){}
/* ICS: подписка на календарь клана */
var ev=document.querySelector('#events .sh');if(ev){var a=document.createElement('a');a.className='btn';a.style.marginTop='12px';a.href='calendar.ics';a.textContent='Скачать календарь (.ics)';a.setAttribute('download','');ev.appendChild(a);
 var w=document.createElement('a');w.className='btn';w.style.cssText='margin:12px 0 0 8px';w.href='webcal://'+location.host+location.pathname.replace(/[^\/]*$/,'')+'calendar.ics';w.textContent='Подписаться';ev.appendChild(w)}
/* доступность: подписи к полям без видимого label */
var L={'soc-t':'Кому','soc-x':'За что благодарность','ps-hs':'Headshot процент','ps-kd':'K/D','ps-m':'Матчей','ps-s':'Минут за сессию','ps-mp':'Любимые карты','mk':'Личный ключ','soc-r':'Твоя реферальная ссылка','cf-s':'Стиль','cf-m':'Карта','cf-r':'Роль','cf-c':'Клиент'};
for(var i in L){var e=document.getElementById(i);if(e&&!e.getAttribute('aria-label'))e.setAttribute('aria-label',L[i])}
})();
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
var SU=window.SOC_URL||'',vid=ls('soc_vid')||'anon';
function nick(){return(ls('gnick')||'').slice(0,16)}
/* ---- кабинет + сезон (очки начисляет сервер) ---- */
function cabinet(){var g=document.querySelector('#eco .ecg'),X=window.__x4;if(!g)return;
 var c=$('cab'),t=$('sea');if(!c){c=document.createElement('div');c.id='cab';c.className='uxc';g.insertBefore(c,g.firstChild);t=document.createElement('div');t.id='sea';t.className='uxc';g.appendChild(t)}
 var n=nick(),rs=0;try{rs=Object.keys(JSON.parse(ls('rsvp6')||'{}')).length}catch(e){}
 var l=X?X.lv(X.S.xp):0;
 c.innerHTML='<h3>Мой кабинет</h3><p>'+(n?'Ник: <b>'+esc(n)+'</b>':'Ник не задан (укажи его в благодарностях).')+'<br>'+(X?'Уровень <b>'+l+'</b> · '+X.S.coins+' ◈<br>':'')+'Отмечено событий: <b>'+rs+'</b><br>Очки недели: <b id="cab-p">—</b> · Приглашено: <b id="cab-r">—</b></p>';
 if(!SU){t.innerHTML='<h3>Сезон недели</h3><small>Появится после подключения сервера.</small>';return}
 fetch(SU+'/season?nick='+encodeURIComponent(n)).then(function(r){return r.json()}).then(function(j){$('cab-p').textContent=j.me;
  t.innerHTML='<h3>Сезон недели</h3><small>Очки за благодарности, отметки на событиях и приглашения. Сброс каждый понедельник.</small>'+(j.top.length?'<table style="width:100%;margin-top:8px;font-size:13px">'+j.top.map(function(r,i){return'<tr><td>'+(i+1)+'</td><td>'+esc(r.nick)+'</td><td>'+r.pts+'</td></tr>'}).join('')+'</table>':'<p><small>Пока никого. Будь первым.</small></p>')}).catch(function(){});
 if(n)fetch(SU+'/ref?code='+encodeURIComponent(n.toLowerCase().replace(/[^a-z0-9._-]/g,''))).then(function(r){return r.json()}).then(function(j){$('cab-r').textContent=j.n}).catch(function(){})}
setTimeout(cabinet,700);
/* ---- вопросы и ответы ---- */
function qList(){if(!SU){$('qa-l').innerHTML='<small>Раздел заработает после подключения сервера.</small>';return}
 fetch(SU+'/qa').then(function(r){return r.json()}).then(function(a){$('qa-l').innerHTML=a.length?a.map(function(x){return'<div class="uxc" style="padding:14px"><b>'+esc(x.q)+'</b><p>'+esc(x.a)+'</p></div>'}).join(''):'<small>Пока нет опубликованных ответов.</small>'}).catch(function(){})}
$('qa-f').addEventListener('submit',function(e){e.preventDefault();var m=$('qa-m');if(!SU){m.textContent='Сервер не подключён.';return}
 fetch(SU+'/qa',{method:'POST',body:JSON.stringify({nick:nick(),q:$('qa-q').value,vid:vid})}).then(function(r){return r.json()}).then(function(j){m.textContent=j.ok?'Отправлено. Ответ появится после проверки.':'Не принято: без ссылок, 5–200 символов, не чаще 3 в час.';if(j.ok)$('qa-q').value=''}).catch(function(){m.textContent='Сервер недоступен.'})});
qList();
})();

/* ---- статус набора (data.json: "recruit":{"open":true,"t":"текст"}) и форма скрима ---- */
(function(){
var DCU="https://discord.gg/Bf2fKNza";
function $(i){return document.getElementById(i)}
function rec(r){var e=$('rcs');if(!e||!r)return;e.className='rcs'+(r.open===false?' off':'');
 e.childNodes[1].textContent=r.t||(r.open===false?'Набор закрыт. Следи за новостями.':'Набор открыт.')+' ';}
fetch('data.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){rec(d.recruit)}).catch(function(){});
var b=$('sc-b');if(b)b.onclick=function(){var t=$('sc-t').value.trim(),c=$('sc-c').value.trim(),d=$('sc-d').value.trim(),m=$('sc-m');
 if(!t||!c||!d){m.textContent='Заполни команду, контакт и время.';return}
 var x='Вызов на скрим от '+t+'\nФормат: '+$('sc-f').value+'\nВремя (МСК): '+d+'\nКонтакт: '+c;
 function go(){m.textContent='Сообщение скопировано. Вставь его в Discord клана.';window.open(DCU,'_blank','noopener')}
 if(navigator.clipboard)navigator.clipboard.writeText(x).then(go,function(){m.textContent=x});else m.textContent=x}})();

/* ---- новости с сервера (бот шлёт сообщения канала) и итоги недели ---- */
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var SU=window.SOC_URL||'',N=[];
function week(d){var t=Date.parse(d);return t&&Date.now()-t<6048e5&&t<=Date.now()+864e5}
function digest(D){var e=$('dgs');if(!e)return;D=D||{};
 var m=(D.members||[]).filter(function(x){return week(x.j)}).length,r=(D.results||[]).filter(function(x){return week(x[1])&&x[2]!=='Скоро'}).length,n=N.filter(function(x){return week(x.d)}),
 c=[['👥',m,'новых участников'],['🏆',r,'сыгранных матчей'],['📰',n.length,'новостей']];
 c=c.filter(function(x){return x[1]>0});if(!c.length&&!n[0]){e.innerHTML='<div class="uxc"><em>🗓️</em><h3>Тихая неделя</h3><p>Новостей пока нет. Загляни в Discord и в календарь событий.</p></div>';return}
 e.innerHTML=c.map(function(x){return'<div class="uxc"><em>'+x[0]+'</em><h3>'+x[1]+'</h3><p>'+x[2]+'</p></div>'}).join('')+(n[0]?'<div class="uxc"><small>Главное</small><h3>'+esc(n[0].t)+'</h3><p>'+esc(n[0].x)+'</p></div>':'')}
function draw(){var e=$('nws');if(!e||!N.length)return;
 e.innerHTML=N.slice().sort(function(a,b){return a.d<b.d?1:-1}).slice(0,6).map(function(n){return'<div class="uxc"><small>'+esc(n.d)+' · '+esc(n.a)+'</small><h3>'+esc(n.t)+'</h3><p>'+esc(n.x)+'</p></div>'}).join('')}
var D0={};fetch('data.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){D0=d;if(Array.isArray(d.news))N=d.news.map(function(n){return{d:n.d,a:n.a,t:n.t,x:n.x}});digest(D0)}).catch(function(){digest(D0)});
if(SU)fetch(SU+'/news').then(function(r){return r.json()}).then(function(a){if(Array.isArray(a)&&a.length){N=a.concat(N);draw();digest(D0)}}).catch(function(){});
})();

/* ---- статус заявки, страницы матчей, Telegram, подписи полей ---- */
(function(){
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function url(u){return /^https?:\/\//.test(u||'')?esc(u):''}
var SU=window.SOC_URL||'',ST={review:'На рассмотрении. Мы ответим в Discord.',accepted:'Принят! Загляни в личные сообщения Discord.',rejected:'К сожалению, отказ. Можно подать заявку позже.'};
var b=$('as-b');if(b)b.onclick=function(){var n=$('as-n').value.trim(),m=$('as-m');if(!n){m.textContent='Введи ник.';return}
 if(!SU){m.textContent='Проверка статуса заработает после подключения сервера.';return}
 fetch(SU+'/app?nick='+encodeURIComponent(n)).then(function(r){return r.json()}).then(function(j){m.textContent=j.s?ST[j.s]:(j.e?'Слишком много запросов, попробуй позже.':'Заявка с таким ником не найдена. Проверь написание.')}).catch(function(){m.textContent='Сервер недоступен.'})};
fetch('data.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){
 var M=d.matches;if(Array.isArray(M)&&M.length){$('matches').hidden=false;
  $('mtl').innerHTML=M.slice(0,12).map(function(x){return'<details><summary>'+esc(x.t)+' · '+esc(x.r)+' · '+esc(x.d)+'</summary><div class="mtd"><span>Карта: '+esc(x.map||'—')+'</span><span>Состав: '+esc((x.lineup||[]).join(', ')||'—')+'</span>'+(x.note?'<span>'+esc(x.note)+'</span>':'')+(url(x.demo)?'<a href="'+url(x.demo)+'" target="_blank" rel="noopener">Демка</a>':'')+(url(x.clip)?'<a href="'+url(x.clip)+'" target="_blank" rel="noopener">Клип</a>':'')+'</div></details>'}).join('')}
 if(d.tg&&url(d.tg)){var f=document.querySelector('footer .l');if(f){var a=document.createElement('a');a.href=url(d.tg);a.target='_blank';a.rel='noopener';a.textContent='Telegram';f.insertBefore(a,f.firstChild)}}
}).catch(function(){});
document.querySelectorAll('input,select,textarea').forEach(function(e){if(e.type==='hidden'||e.type==='checkbox'||e.type==='radio'||e.getAttribute('aria-label')||e.id&&document.querySelector('label[for="'+e.id+'"]')||e.closest('label'))return;var t=e.placeholder||e.name||e.id;if(t)e.setAttribute('aria-label',t)});
})();
