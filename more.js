/* кнопка «Ещё»: открывает скрытые разделы по одному */
(function(){var G=[['Клан',[['Что нового','news'],['События','events'],['Итоги недели','digest'],['Контент-план','plan'],['Активность','act'],['История','x5h'],['Доска почёта','hof'],['Отзывы','reviews']]],['Участникам',[['Моя статистика','pst'],['Для своих','mbr'],['Вызовы','bounty'],['Опрос','poll'],['Лента клана','feed'],['Комьюнити','soc'],['Стрим','stream']]],['Игры',[['Игровая зона','x5g'],['Тир','game'],['Экономика','eco'],['Подходишь ли ты клану?','x5q'],['Рофл-конфиг','x5f'],['Конфиг-билдер','cfb']]],['Полезное',[['Софт','soft'],['Гайд','guide'],['Скрим','scrim'],['Статус заявки','appst'],['Вопросы клану','qa']]]];
var nav=document.querySelector('nav .w');if(!nav)return;var dc=nav.querySelector('.btn.d');
var b=document.createElement('button');b.type='button';b.className='btn';b.id='mre';b.setAttribute('aria-expanded','false');b.textContent='Ещё ▾';nav.insertBefore(b,dc||null);
var p=document.createElement('div');p.id='mrp';p.hidden=true;
p.innerHTML=G.map(function(g){return'<div class="mg"><b>'+g[0]+'</b>'+g[1].map(function(i){return'<button type="button" data-s="'+i[1]+'">'+i[0]+'</button>'}).join('')+'</div>'}).join('');
document.body.appendChild(p);
function tog(v){p.hidden=v===undefined?!p.hidden:!v;b.setAttribute('aria-expanded',String(!p.hidden))}
function shut(){var o=document.querySelector('section.mx');if(o){o.classList.remove('mx');var x=o.querySelector('.mxc');if(x)x.remove()}}
function open(id){var t=document.getElementById(id);if(!t)return;shut();t.classList.add('mx','in');var x=document.createElement('button');x.type='button';x.className='mxc';x.textContent='✕ Закрыть раздел';x.onclick=function(){shut();scrollTo({top:0,behavior:'smooth'})};t.insertBefore(x,t.firstChild);setTimeout(function(){t.scrollIntoView({behavior:'smooth',block:'start'})},60)}
b.onclick=function(e){e.stopPropagation();tog()};
p.onclick=function(e){var s=e.target.closest('button[data-s]');if(s){tog(false);open(s.dataset.s)}};
document.addEventListener('click',function(e){if(!p.hidden&&!p.contains(e.target))tog(false)});
addEventListener('keydown',function(e){if(e.key==='Escape')tog(false)});
})();
