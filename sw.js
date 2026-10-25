const CACHE='swim-week-v4';
const ASSETS=['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'fonts/bc-600.woff2', 'fonts/bc-700.woff2', 'fonts/ah-400.woff2', 'fonts/ah-700.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const page=r.mode==='navigate'||r.url.endsWith('/index.html');
  if(page){ // fresh when online, cached copy when offline
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res})
      .catch(()=>caches.match('index.html').then(m=>m||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})));
});
