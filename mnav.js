/* нижнее меню на телефоне: главные разделы + «Ещё» */
(function(){var I={about:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',roster:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3-6 6.5-6s6 2 6.5 6M16 5.2a3.4 3.4 0 010 5.6M18.5 14.5c1.7.8 2.7 2.6 3 5.5"/>',media:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z"/>',apply:'<path d="M5 4h10l4 4v12H5z"/><path d="M9 13h6M9 17h4"/>',more:'<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>'},
T=[['О нас','about'],['Состав','roster'],['Медиа','media'],['Заявка','apply']],
n=document.createElement('div');n.id='mnav';n.setAttribute('role','navigation');n.setAttribute('aria-label','Разделы');
n.innerHTML=T.map(function(t){return'<a href="#'+t[1]+'" data-t="'+t[1]+'"><svg viewBox="0 0 24 24">'+I[t[1]]+'</svg>'+t[0]+'</a>'}).join('')+'<button type="button" id="mnm"><svg viewBox="0 0 24 24">'+I.more+'</svg>Ещё</button>';
document.body.appendChild(n);
n.querySelector('#mnm').onclick=function(e){e.stopPropagation();var m=document.getElementById('mre');if(m)m.click()};
if('IntersectionObserver' in window){var L=[].slice.call(n.querySelectorAll('a')),io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)L.forEach(function(a){a.classList.toggle('on',a.dataset.t===e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
T.forEach(function(t){var s=document.getElementById(t[1]);if(s)io.observe(s)})}
})();
