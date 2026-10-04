/* Live-публикация: подмешивает данные воркера (/pub) к data.json, чтобы правки из Discord и админки были видны сразу, без выкладки файлов. */
(function(){var f=window.fetch;if(!f)return;
function id(x){return x&&(x.id||x.n||x.t)}
function mix(d,p){Object.keys(p).forEach(function(k){if(k==='_ts'||k==='hide'||k==='events')return;var v=p[k];
 if(Array.isArray(v)){var ids={};v.forEach(function(x){ids[id(x)]=1});d[k]=v.concat((Array.isArray(d[k])?d[k]:[]).filter(function(x){return !ids[id(x)]}))}
 else if(v&&typeof v==='object')d[k]=Object.assign({},d[k]||{},v);else d[k]=v});
 (p.hide||[]).forEach(function(h){var i=h.indexOf(':'),k=h.slice(0,i),v=h.slice(i+1);if(Array.isArray(d[k]))d[k]=d[k].filter(function(x){return String(id(x))!==v})});
 if(p._ts)d.ts=Math.max(d.ts||0,p._ts);return d}
window.fetch=function(u){var url=typeof u==='string'?u:(u&&u.url)||'',a=arguments,self=this;
 if(!window.SOC_URL||!/(^|\/)data\.json(\?|$)/.test(url))return f.apply(self,a);
 return f.apply(self,a).then(function(r){
  return Promise.all([r.clone().json(),Promise.race([f(window.SOC_URL+'/pub',{cache:'no-store'}).then(function(x){return x.ok?x.json():{}}),new Promise(function(ok){setTimeout(function(){ok({})},3500)})]).catch(function(){return{}})])
   .then(function(z){return new Response(JSON.stringify(mix(z[0],z[1])),{status:200,headers:{'Content-Type':'application/json'}})})
   .catch(function(){return r})})}})();

/* возврат с входа через Discord: токен сессии кладём в sessionStorage и открываем админку */
(function(){var m=/^#admin-auth=(ds\.[\w.-]+)$/.exec(location.hash);try{if(m){sessionStorage.setItem('pubk',m[1]);history.replaceState(null,'',location.pathname+location.search);location.hash='#admin'}else if(location.hash==='#admin-denied'){history.replaceState(null,'',location.pathname+location.search);setTimeout(function(){alert('Нет доступа: нужна админская роль на сервере Discord.')},300)}}catch(e){}})();
