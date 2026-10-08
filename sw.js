const CACHE='cl4n-v61';
const PRECACHE=['./','./index.html','./offline.html','./manifest.webmanifest','./community.js','./i18n.js','./i18n-x.js','./live.js','./community.css','./scroll3d.js','./more.js','./mnav.js','./install.js','./loader.js','./dl.js','./launcher.html'];

self.addEventListener('install',e=>{
  /* add one by one: a missing file must not break the whole install */
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PRECACHE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  /* only our own origin: Discord API, fonts, YouTube etc. go straight to the network */
  if(url.origin!==location.origin)return;
  /* data.json and sw.js are always fresh (admin publishes through data.json) */
  if(/\/(data\.json|sw\.js)$/.test(url.pathname))return;
  /* pages: network first, then cached copy, then offline page */
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{
      if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(req,c))}
      return r;
    }).catch(()=>caches.match(req).then(m=>m||caches.match('./index.html')).then(m=>m||caches.match('./offline.html'))));
    return;
  }
  /* static files: cache first, refresh in background */
  e.respondWith(caches.match(req).then(cached=>{
    const net=fetch(req).then(r=>{
      if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(req,c))}
      return r;
    }).catch(()=>cached);
    return cached||net;
  }));
});
