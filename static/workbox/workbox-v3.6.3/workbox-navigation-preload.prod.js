(this.workbox = this.workbox || {}),
  (this.workbox.navigationPreload = (function(t) {
    "use strict";
    try {
      self.workbox.v["workbox:navigation-preload:3.6.3"] = 1;
    } catch (t) {}
    function e() {
      return Boolean(self.registration && self.registration.navigationPreload);
    }
    return (
      (t.disable = function() {
        e() &&
          self.addEventListener("activate", t => {
            t.waitUntil(
              self.registration.navigationPreload.disable().then(() => {})
            );
          });
      }),
      (t.enable = function(t) {
        e() &&
          self.addEventListener("activate", e => {
            e.waitUntil(
              self.registration.navigationPreload.enable().then(() => {
                t && self.registration.navigationPreload.setHeaderValue(t);
              })
            );
          });
      }),
      (t.isSupported = e),
      t
    );
  })({}));

//# sourceMappingURL=workbox-navigation-preload.prod.js.map
