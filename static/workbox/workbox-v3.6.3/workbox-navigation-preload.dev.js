this.workbox = this.workbox || {};
this.workbox.navigationPreload = (function(exports, logger_mjs) {
  "use strict";

  try {
    self.workbox.v["workbox:navigation-preload:3.6.3"] = 1;
  } catch (e) {} // eslint-disable-line

  /*
    Copyright 2018 Google Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  */

  /**
   * @return {boolean} Whether or not the current browser supports enabling
   * navigation preload.
   *
   * @memberof workbox.navigationPreload
   */
  function isSupported() {
    return Boolean(self.registration && self.registration.navigationPreload);
  }

  /*
    Copyright 2017 Google Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  */

  /**
   * If the browser supports Navigation Preload, then this will disable it.
   *
   * @memberof workbox.navigationPreload
   */
  function disable() {
    if (isSupported()) {
      self.addEventListener("activate", event => {
        event.waitUntil(
          self.registration.navigationPreload.disable().then(() => {
            {
              logger_mjs.logger.log(`Navigation preload is disabled.`);
            }
          })
        );
      });
    } else {
      {
        logger_mjs.logger.log(
          `Navigation preload is not supported in this browser.`
        );
      }
    }
  }

  /*
    Copyright 2017 Google Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  */

  /**
   * If the browser supports Navigation Preload, then this will enable it.
   *
   * @param {string} [headerValue] Optionally, allows developers to
   * [override](https://developers.google.com/web/updates/2017/02/navigation-preload#changing_the_header)
   * the value of the `Service-Worker-Navigation-Preload` header which will be
   * sent to the server when making the navigation request.
   *
   * @memberof workbox.navigationPreload
   */
  function enable(headerValue) {
    if (isSupported()) {
      self.addEventListener("activate", event => {
        event.waitUntil(
          self.registration.navigationPreload.enable().then(() => {
            // Defaults to Service-Worker-Navigation-Preload: true if not set.
            if (headerValue) {
              self.registration.navigationPreload.setHeaderValue(headerValue);
            }

            {
              logger_mjs.logger.log(`Navigation preload is enabled.`);
            }
          })
        );
      });
    } else {
      {
        logger_mjs.logger.log(
          `Navigation preload is not supported in this browser.`
        );
      }
    }
  }

  /*
    Copyright 2017 Google Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  */

  /*
    Copyright 2017 Google Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  */

  exports.disable = disable;
  exports.enable = enable;
  exports.isSupported = isSupported;

  return exports;
})({}, workbox.core._private);

//# sourceMappingURL=workbox-navigation-preload.dev.js.map
