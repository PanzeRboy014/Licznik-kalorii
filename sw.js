const CACHE='kalorie-v2';
const FILES=['./','./index.html','./produkty.json','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
// usuwa tylko własne, stare cache (nie rusza cache Słówek)
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('kalorie-')&&x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  const own=u.origin===location.origin, font=u.hostname.endsWith('fonts.googleapis.com')||u.hostname.endsWith('fonts.gstatic.com');
  if(!own&&!font)return; // Open Food Facts itp. idzie prosto do sieci
  const req=own?new Request(e.request,{cache:'no-cache'}):e.request;
  e.respondWith(fetch(req).then(r=>{if(r.ok||r.type==='opaque'){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):undefined))));
});
