(this.workbox = this.workbox || {}),
  (this.workbox.broadcastUpdate = (function(t) {
    "use strict";
    try {
      self.workbox.v["workbox:broadcast-cache-update:3.6.3"] = 1;
    } catch (t) {}
    const e = (t, e, s) => {
      return (
        !s.some(s => t.headers.has(s) && e.headers.has(s)) ||
        s.every(s => {
          const a = t.headers.has(s) === e.headers.has(s),
            n = t.headers.get(s) === e.headers.get(s);
          return a && n;
        })
      );
    };
    var s = { CACHE_UPDATED: "CACHE_UPDATED" };
    const a = (t, e, a, n) => {
      "BroadcastChannel" in self &&
        t &&
        t.postMessage({
          type: s.CACHE_UPDATED,
          meta: n,
          payload: { cacheName: e, updatedUrl: a }
        });
    };
    class n {
      constructor(t, { headersToCheck: e, source: s } = {}) {
        (this.t = t),
          (this.e = e || ["content-length", "etag", "last-modified"]),
          (this.s = s || "workbox-broadcast-cache-update");
      }
      a() {
        return (
          "BroadcastChannel" in self &&
            !this.n &&
            (this.n = new BroadcastChannel(this.t)),
          this.n
        );
      }
      notifyIfUpdated(t, s, n, c) {
        e(t, s, this.e) || a(this.a(), c, n, this.s);
      }
    }
    return (
      (t.BroadcastCacheUpdate = n),
      (t.Plugin = class {
        constructor(t, e) {
          this.c = new n(t, e);
        }
        cacheDidUpdate({
          cacheName: t,
          oldResponse: e,
          newResponse: s,
          request: a
        }) {
          e && this.c.notifyIfUpdated(e, s, a.url, t);
        }
      }),
      (t.broadcastUpdate = a),
      (t.messageTypes = s),
      t
    );
  })({}));

//# sourceMappingURL=workbox-broadcast-cache-update.prod.js.map
