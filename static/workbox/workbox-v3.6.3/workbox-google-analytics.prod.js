(this.workbox = this.workbox || {}),
  (this.workbox.googleAnalytics = (function(e, n, t, o, r, c, s) {
    "use strict";
    try {
      self.workbox.v["workbox:google-analytics:3.6.3"] = 1;
    } catch (e) {}
    const l = /^\/(\w+\/)?collect/,
      i = ((a = babelHelpers.asyncToGenerator(function*(e) {
        return yield new Promise(function(n, t) {
          const o = new FileReader();
          (o.onloadend = function() {
            return n(o.result);
          }),
            (o.onerror = function() {
              return t(o.error);
            }),
            o.readAsText(e);
        });
      })),
      function(e) {
        return a.apply(this, arguments);
      });
    var a;
    const w = e => (
      (u = babelHelpers.asyncToGenerator(function*(n) {
        let t,
          { url: o, requestInit: r, timestamp: c } = n;
        if (((o = new URL(o)), r.body)) {
          const e = r.body instanceof Blob ? yield i(r.body) : r.body;
          t = new URLSearchParams(e);
        } else t = o.searchParams;
        const s = c - (Number(t.get("qt")) || 0),
          l = Date.now() - s;
        if ((t.set("qt", l), e.parameterOverrides))
          for (const n of Object.keys(e.parameterOverrides)) {
            const o = e.parameterOverrides[n];
            t.set(n, o);
          }
        "function" == typeof e.hitFilter && e.hitFilter.call(null, t),
          (r.body = t.toString()),
          (r.method = "POST"),
          (r.mode = "cors"),
          (r.credentials = "omit"),
          (r.headers = { "Content-Type": "text/plain" }),
          (n.url = `${o.origin}${o.pathname}`);
      })),
      function(e) {
        return u.apply(this, arguments);
      }
    );
    var u;
    return (
      (e.initialize = (e = {}) => {
        const i = t.cacheNames.getGoogleAnalyticsName(e.cacheName),
          a = new n.Plugin("workbox-google-analytics", {
            maxRetentionTime: 2880,
            callbacks: { requestWillReplay: w(e) }
          }),
          u = [
            (e => {
              const n = new c.NetworkFirst({ cacheName: e });
              return new o.Route(
                ({ url: e }) =>
                  "www.google-analytics.com" === e.hostname &&
                  "/analytics.js" === e.pathname,
                n,
                "GET"
              );
            })(i),
            (e => {
              const n = new c.NetworkFirst({ cacheName: e });
              return new o.Route(
                ({ url: e }) =>
                  "www.googletagmanager.com" === e.hostname &&
                  "/gtag/js" === e.pathname,
                n,
                "GET"
              );
            })(i),
            ...(e => {
              const n = ({ url: e }) =>
                  "www.google-analytics.com" === e.hostname &&
                  l.test(e.pathname),
                t = new s.NetworkOnly({ plugins: [e] });
              return [new o.Route(n, t, "GET"), new o.Route(n, t, "POST")];
            })(a)
          ],
          f = new r.Router();
        for (const e of u) f.registerRoute(e);
        self.addEventListener("fetch", e => {
          const n = f.handleRequest(e);
          n && e.respondWith(n);
        });
      }),
      e
    );
  })(
    {},
    workbox.backgroundSync,
    workbox.core._private,
    workbox.routing,
    workbox.routing,
    workbox.strategies,
    workbox.strategies
  ));

//# sourceMappingURL=workbox-google-analytics.prod.js.map
