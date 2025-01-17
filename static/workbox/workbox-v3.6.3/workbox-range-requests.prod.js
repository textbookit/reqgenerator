(this.workbox = this.workbox || {}),
  (this.workbox.rangeRequests = (function(e, n) {
    "use strict";
    try {
      self.workbox.v["workbox:range-requests:3.6.3"] = 1;
    } catch (e) {}
    let t = ((r = babelHelpers.asyncToGenerator(function*(e, t) {
      try {
        const r = e.headers.get("range");
        if (!r) throw new n.WorkboxError("no-range-header");
        const s = (function(e) {
            const t = e.trim().toLowerCase();
            if (!t.startsWith("bytes="))
              throw new n.WorkboxError("unit-must-be-bytes", {
                normalizedRangeHeader: t
              });
            if (t.includes(","))
              throw new n.WorkboxError("single-range-only", {
                normalizedRangeHeader: t
              });
            const r = /(\d*)-(\d*)/.exec(t);
            if (null === r || (!r[1] && !r[2]))
              throw new n.WorkboxError("invalid-range-values", {
                normalizedRangeHeader: t
              });
            return {
              start: "" === r[1] ? null : Number(r[1]),
              end: "" === r[2] ? null : Number(r[2])
            };
          })(r),
          a = yield t.blob(),
          i = (function(e, t, r) {
            const s = e.size;
            if (r > s || t < 0)
              throw new n.WorkboxError("range-not-satisfiable", {
                size: s,
                end: r,
                start: t
              });
            let a, i;
            return (
              null === t
                ? ((a = s - r), (i = s))
                : null === r
                ? ((a = t), (i = s))
                : ((a = t), (i = r + 1)),
              { start: a, end: i }
            );
          })(a, s.start, s.end),
          l = a.slice(i.start, i.end),
          o = l.size,
          u = new Response(l, {
            status: 206,
            statusText: "Partial Content",
            headers: t.headers
          });
        return (
          u.headers.set("Content-Length", o),
          u.headers.set(
            "Content-Range",
            `bytes ${i.start}-${i.end - 1}/` + a.size
          ),
          u
        );
      } catch (e) {
        return new Response("", {
          status: 416,
          statusText: "Range Not Satisfiable"
        });
      }
    })),
    function(e, n) {
      return r.apply(this, arguments);
    });
    var r;
    return (
      (e.createPartialResponse = t),
      (e.Plugin = class {
        cachedResponseWillBeUsed({ request: e, cachedResponse: n }) {
          return babelHelpers.asyncToGenerator(function*() {
            return n && e.headers.has("range") ? yield t(e, n) : n;
          })();
        }
      }),
      e
    );
  })({}, workbox.core._private));

//# sourceMappingURL=workbox-range-requests.prod.js.map
