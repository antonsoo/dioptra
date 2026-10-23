/* Offline edition ec4ab2b33ed2ab218a67610a8cf415e075a8df0ceb026f5baf3f8c79e90726ee. Generated from the complete build. */
const CACHE = "dioptra-ec4ab2b33ed2ab218a67610a8cf415e075a8df0ceb026f5baf3f8c79e90726ee";
const EDITION = "ec4ab2b33ed2ab218a67610a8cf415e075a8df0ceb026f5baf3f8c79e90726ee";
const BASE = "/dioptra/";
const FILES = ["/dioptra/assets/main-D2wZ2yLE.css","/dioptra/assets/main-DWYf6G3R.js","/dioptra/fonts/IBMPlex-OFL.txt","/dioptra/fonts/IBMPlexSans-Regular.woff2","/dioptra/fonts/IBMPlexSans-SemiBold.woff2","/dioptra/fonts/NotoSerif-OFL.txt","/dioptra/fonts/NotoSerif-Regular.ttf","/dioptra/icon.svg","/dioptra/index.html","/dioptra/sources/CC-BY-SA-4.0.txt","/dioptra/sources/NOTICES.txt","/dioptra/sources/dioptra-grc.xml","/dioptra/sources/manifest.json","/dioptra/sources/schone-238.jpg","/dioptra/sources/schone-239.jpg","/dioptra/sources/schone-240.jpg","/dioptra/sources/schone-241.jpg"];
const INTEGRITY = {"/dioptra/assets/main-D2wZ2yLE.css":"sha256-Dm/eLZVMSRwy3KKHaWhJO8HcEOiFTXQ8BkPgAE1QQlw=","/dioptra/assets/main-DWYf6G3R.js":"sha256-jy0+l9EQC5ZXDLO48dk3kOKa2nSYYyXOWsXRROXUXZE=","/dioptra/fonts/IBMPlex-OFL.txt":"sha256-fmsoGO29j2oBroBkHMjxalEIDQj7TlMr46C290rbB9o=","/dioptra/fonts/IBMPlexSans-Regular.woff2":"sha256-unEaMIX/nydEC2ucRVDPxHyXvzZZHV2pWLl1uzrdjBo=","/dioptra/fonts/IBMPlexSans-SemiBold.woff2":"sha256-94BIAw6rYuhg76OaDfeeLlWBvxIuuVubxCwLikmI0gU=","/dioptra/fonts/NotoSerif-OFL.txt":"sha256-zumJL58MyP6ILJ6VN+5qiWIdhu586vcLAuKyscJcBho=","/dioptra/fonts/NotoSerif-Regular.ttf":"sha256-VHPS5DvdAY7hJKSt26gJH9CimJSxIcu3QQI69lSWYrY=","/dioptra/icon.svg":"sha256-CUskT68I8ijfG+GJX8cmqb/dKQdvhJ1mwhdoeCcSOus=","/dioptra/index.html":"sha256-jTha++x/39nYgpVsW/vdEYsl7qCtxSD6dEzhNtBx5k4=","/dioptra/sources/CC-BY-SA-4.0.txt":"sha256-KKlSnH0LtNxR9L9cEWo9Fu8kegUvdZFGZ2jd9WP9HPU=","/dioptra/sources/NOTICES.txt":"sha256-WhbXy3qTbQhbrntCkgR78CapTrlh0DQVv5KLnE5Qcfs=","/dioptra/sources/dioptra-grc.xml":"sha256-KmxPfpOcjSbf8yzmcTpXx1BpPK3Wm2yRq+jBnC+9o34=","/dioptra/sources/manifest.json":"sha256-yqDimUjIuyBbxHqW0L5HV7i4U/cf/VLQL18kwRW9fJQ=","/dioptra/sources/schone-238.jpg":"sha256-fFItYoCmWEE/Nocy8OH79F4SQqRcQp5b9Rdox2bpELc=","/dioptra/sources/schone-239.jpg":"sha256-abPAFeHCHGcwKyIB17bz7HNe/XiiwQ4f5UR9x4eg7CA=","/dioptra/sources/schone-240.jpg":"sha256-l80OcPsom0YgqfRYYuSgYjJeUgRF0bHeLEEVH2s3nkA=","/dioptra/sources/schone-241.jpg":"sha256-m30vLl5QHNX/GtZp+SGplcmWJUtfRM0uHO+WE/EnFW0="};
self.addEventListener("install", event => {
  // HTTP success does not establish edition identity. A stale entry page or
  // substituted scan must fail the complete install before this worker activates.
  const requests = FILES.map(url => new Request(url, { cache: "reload", integrity: INTEGRITY[url] }));
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(requests)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("dioptra-") && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("message", event => {
  if (event.data?.type === "DIOPTRA_ACTIVATE") {
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (event.data?.type !== "DIOPTRA_INSPECT" || !event.ports[0]) return;
  // A late reply from a superseded worker must not recreate its deleted cache.
  event.waitUntil(Promise.all(FILES.map(file => caches.match(file, { cacheName: CACHE }))).then(saved => {
    event.ports[0].postMessage({ type: "DIOPTRA_EDITION", edition: EDITION, complete: saved.every(Boolean) });
  }).catch(() => event.ports[0].postMessage({ type: "DIOPTRA_EDITION", edition: EDITION, complete: false })));
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (event.request.mode === "navigate") {
    const page = url.pathname === BASE || url.pathname === BASE + "index.html" ? BASE + "index.html" : url.pathname;
    if (FILES.includes(page)) event.respondWith(fetch(event.request).catch(() => caches.match(page, { cacheName: CACHE })));
  } else if (FILES.includes(url.pathname)) {
    event.respondWith(caches.match(url.pathname, { cacheName: CACHE }).then(cached => cached || fetch(event.request)));
  }
});
