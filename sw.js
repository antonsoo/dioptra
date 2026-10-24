/* Offline edition d5e47c10c26fe1b8bcf69373e78aec8e0d61e91f8611d6eca46ef60d801c7232. Generated from the complete build. */
const CACHE = "dioptra-d5e47c10c26fe1b8bcf69373e78aec8e0d61e91f8611d6eca46ef60d801c7232";
const EDITION = "d5e47c10c26fe1b8bcf69373e78aec8e0d61e91f8611d6eca46ef60d801c7232";
const BASE = "/dioptra/";
const FILES = ["/dioptra/assets/flow-BUSdbjnl.css","/dioptra/assets/flow-D0PsEm_d.js","/dioptra/assets/main-BzrxNStd.js","/dioptra/assets/main-D2wZ2yLE.css","/dioptra/assets/offline-B9WRF_hC.js","/dioptra/flow.html","/dioptra/fonts/IBMPlex-OFL.txt","/dioptra/fonts/IBMPlexSans-Regular.woff2","/dioptra/fonts/IBMPlexSans-SemiBold.woff2","/dioptra/fonts/NotoSerif-OFL.txt","/dioptra/fonts/NotoSerif-Regular.ttf","/dioptra/icon.svg","/dioptra/index.html","/dioptra/sources/CC-BY-SA-4.0.txt","/dioptra/sources/NOTICES.txt","/dioptra/sources/dioptra-grc.xml","/dioptra/sources/manifest.json","/dioptra/sources/schone-238.jpg","/dioptra/sources/schone-239.jpg","/dioptra/sources/schone-240.jpg","/dioptra/sources/schone-241.jpg","/dioptra/sources/schone-284.jpg","/dioptra/sources/schone-285.jpg","/dioptra/sources/schone-286.jpg","/dioptra/sources/schone-287.jpg"];
const INTEGRITY = {"/dioptra/assets/flow-BUSdbjnl.css":"sha256-V1hQ9NtAn0K/HIwM7Aq58Buf2cwrjFFtPx/KrYKFbKk=","/dioptra/assets/flow-D0PsEm_d.js":"sha256-jDzCik5BBFnygRAFaAYJDKLqq2942m7DN5rzXyk+xyU=","/dioptra/assets/main-BzrxNStd.js":"sha256-XfYcotrVbtSknqOY60B0SS7W/5QPLFnigLE1lE5prro=","/dioptra/assets/main-D2wZ2yLE.css":"sha256-Dm/eLZVMSRwy3KKHaWhJO8HcEOiFTXQ8BkPgAE1QQlw=","/dioptra/assets/offline-B9WRF_hC.js":"sha256-DcTry7MrkK6itbTWan64z8w42pmuFeWFeGAL+ua8wvI=","/dioptra/flow.html":"sha256-puY/oNlJFlFkunkkIKZgmsDSpmrOh8GEzqnwqI/tfWo=","/dioptra/fonts/IBMPlex-OFL.txt":"sha256-fmsoGO29j2oBroBkHMjxalEIDQj7TlMr46C290rbB9o=","/dioptra/fonts/IBMPlexSans-Regular.woff2":"sha256-unEaMIX/nydEC2ucRVDPxHyXvzZZHV2pWLl1uzrdjBo=","/dioptra/fonts/IBMPlexSans-SemiBold.woff2":"sha256-94BIAw6rYuhg76OaDfeeLlWBvxIuuVubxCwLikmI0gU=","/dioptra/fonts/NotoSerif-OFL.txt":"sha256-zumJL58MyP6ILJ6VN+5qiWIdhu586vcLAuKyscJcBho=","/dioptra/fonts/NotoSerif-Regular.ttf":"sha256-VHPS5DvdAY7hJKSt26gJH9CimJSxIcu3QQI69lSWYrY=","/dioptra/icon.svg":"sha256-CUskT68I8ijfG+GJX8cmqb/dKQdvhJ1mwhdoeCcSOus=","/dioptra/index.html":"sha256-eD0fWCU6/iZ64uYm8+BqJwMWtcABbCZloVdn8r6OSaY=","/dioptra/sources/CC-BY-SA-4.0.txt":"sha256-KKlSnH0LtNxR9L9cEWo9Fu8kegUvdZFGZ2jd9WP9HPU=","/dioptra/sources/NOTICES.txt":"sha256-bv4PIuwtL1FtkCzIZPYDV9gWa0e4s/S6ASfGJxyPrEU=","/dioptra/sources/dioptra-grc.xml":"sha256-KmxPfpOcjSbf8yzmcTpXx1BpPK3Wm2yRq+jBnC+9o34=","/dioptra/sources/manifest.json":"sha256-Fxv2VdCjsS/j8VpaIzIWniEb9/6h3Kl4XHNCQ+H8o4Q=","/dioptra/sources/schone-238.jpg":"sha256-fFItYoCmWEE/Nocy8OH79F4SQqRcQp5b9Rdox2bpELc=","/dioptra/sources/schone-239.jpg":"sha256-abPAFeHCHGcwKyIB17bz7HNe/XiiwQ4f5UR9x4eg7CA=","/dioptra/sources/schone-240.jpg":"sha256-l80OcPsom0YgqfRYYuSgYjJeUgRF0bHeLEEVH2s3nkA=","/dioptra/sources/schone-241.jpg":"sha256-m30vLl5QHNX/GtZp+SGplcmWJUtfRM0uHO+WE/EnFW0=","/dioptra/sources/schone-284.jpg":"sha256-Mv8Qm0nqp3tQfFreAVmPYQVoa6Op0tmnxJt60dWRb4Q=","/dioptra/sources/schone-285.jpg":"sha256-FN/timCmKJOQRnf/Ft8j43k8CbXPcWI5G1flsfTe9jg=","/dioptra/sources/schone-286.jpg":"sha256-EIcfUWTQMHZpA/pBzQN6eEz6G3vxim2NJCeCtNDS428=","/dioptra/sources/schone-287.jpg":"sha256-9c63E9FyCyIjA+qUcq0EWfzE+6FU+q9vl8mA8keJ8aE="};
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
