this.workbox = this.workbox || {};
this.workbox.routing = (function(
  assert_mjs,
  logger_mjs,
  WorkboxError_mjs,
  getFriendlyURL_mjs,
  cacheNames_mjs
) {
  "use strict";

  try {
    self.workbox.v["workbox:routing:3.6.3"] = 1;
  } catch (e) {} // eslint-disable-line

  /*
   Copyright 2017 Google Inc. All Rights Reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  */

  /**
   * The default HTTP method, 'GET', used when there's no specific method
   * configured for a route.
   *
   * @type {string}
   *
   * @private
   */
  const defaultMethod = "GET";

  /**
   * The list of valid HTTP methods associated with requests that could be routed.
   *
   * @type {Array<string>}
   *
   * @private
   */
  const validMethods = ["DELETE", "GET", "HEAD", "PATCH", "POST", "PUT"];

  /*
   Copyright 2017 Google Inc. All Rights Reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  */

  /**
   * @param {function()|Object} handler Either a function, or an object with a
   * 'handle' method.
   * @return {Object} An object with a handle method.
   *
   * @private
   */
  var normalizeHandler = handler => {
    if (handler && typeof handler === "object") {
      {
        assert_mjs.assert.hasMethod(handler, "handle", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return handler;
    } else {
      {
        assert_mjs.assert.isType(handler, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return { handle: handler };
    }
  };

  /*
   Copyright 2017 Google Inc. All Rights Reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  */

  /**
   * A `Route` consists of a pair of callback functions, "match" and "handler".
   * The "match" callback determine if a route should be used to "handle" a
   * request by returning a non-falsy value if it can. The "handler" callback
   * is called when there is a match and should return a Promise that resolves
   * to a `Response`.
   *
   * @memberof workbox.routing
   */
  class Route {
    /**
     * Constructor for Route class.
     *
     * @param {workbox.routing.Route~matchCallback} match
     * A callback function that determines whether the route matches a given
     * `fetch` event by returning a non-falsy value.
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */
    constructor(match, handler, method) {
      {
        assert_mjs.assert.isType(match, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "match"
        });

        if (method) {
          assert_mjs.assert.isOneOf(method, validMethods, {
            paramName: "method"
          });
        }
      }

      // These values are referenced directly by Router so cannot be
      // altered by minifification.
      this.handler = normalizeHandler(handler);
      this.match = match;
      this.method = method || defaultMethod;
    }
  }

  /*
   Copyright 2017 Google Inc. All Rights Reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  */

  /**
   * RegExpRoute makes it easy to create a regular expression based
   * [Route]{@link workbox.routing.Route}.
   *
   * For same-origin requests the RegExp only needs to match part of the URL. For
   * requests against third-party servers, you must define a RegExp that matches
   * the start of the URL.
   *
   * [See the module docs for info.]{@link https://developers.google.com/web/tools/workbox/modules/workbox-routing}
   *
   * @memberof workbox.routing
   * @extends workbox.routing.Route
   */
  class RegExpRoute extends Route {
    /**
     * If the regulard expression contains
     * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
     * th ecaptured values will be passed to the
     * [handler's]{@link workbox.routing.Route~handlerCallback} `params`
     * argument.
     *
     * @param {RegExp} regExp The regular expression to match against URLs.
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */
    constructor(regExp, handler, method) {
      {
        assert_mjs.assert.isInstance(regExp, RegExp, {
          moduleName: "workbox-routing",
          className: "RegExpRoute",
          funcName: "constructor",
          paramName: "pattern"
        });
      }

      const match = ({ url }) => {
        const result = regExp.exec(url.href);

        // Return null immediately if there's no match.
        if (!result) {
          return null;
        }

        // Require that the match start at the first character in the URL string
        // if it's a cross-origin request.
        // See https://github.com/GoogleChrome/workbox/issues/281 for the context
        // behind this behavior.
        if (url.origin !== location.origin && result.index !== 0) {
          {
            logger_mjs.logger.debug(
              `The regular expression '${regExp}' only partially matched ` +
                `against the cross-origin URL '${url}'. RegExpRoute's will only ` +
                `handle cross-origin requests if they match the entire URL.`
            );
          }

          return null;
        }

        // If the route matches, but there aren't any capture groups defined, then
        // this will return [], which is truthy and therefore sufficient to
        // indicate a match.
        // If there are capture groups, then it will return their values.
        return result.slice(1);
      };

      super(match, handler, method);
    }
  }

  /*
   Copyright 2017 Google Inc. All Rights Reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  */

  /**
   * The Router can be used to process a FetchEvent through one or more
   * [Routes]{@link workbox.routing.Route} responding  with a Request if
   * a matching route exists.
   *
   * If no route matches a given a request, the Router will use a "default"
   * handler if one is defined.
   *
   * Should the matching Route throw an error, the Router will use a "catch"
   * handler if one is defined to gracefully deal with issues and respond with a
   * Request.
   *
   * If a request matches multiple routes, the **earliest** registered route will
   * be used to respond to the request.
   *
   * @memberof workbox.routing
   */
  class Router {
    /**
     * Initializes a new Router.
     */
    constructor() {
      // _routes will contain a mapping of HTTP method name ('GET', etc.) to an
      // array of all the corresponding Route instances that are registered.
      this._routes = new Map();
    }

    /**
     * Apply the routing rules to a FetchEvent object to get a Response from an
     * appropriate Route's handler.
     *
     * @param {FetchEvent} event The event from a service worker's 'fetch' event
     * listener.
     * @return {Promise<Response>|undefined} A promise is returned if a
     * registered route can handle the FetchEvent's request. If there is no
     * matching route and there's no `defaultHandler`, `undefined` is returned.
     */
    handleRequest(event) {
      {
        assert_mjs.assert.isInstance(event, FetchEvent, {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "handleRequest",
          paramName: "event"
        });
      }

      const url = new URL(event.request.url);
      if (!url.protocol.startsWith("http")) {
        {
          logger_mjs.logger.debug(
            `Workbox Router only supports URLs that start with 'http'.`
          );
        }
        return;
      }

      let route = null;
      let handler = null;
      let params = null;
      let debugMessages = [];

      const result = this._findHandlerAndParams(event, url);
      handler = result.handler;
      params = result.params;
      route = result.route;
      {
        if (handler) {
          debugMessages.push([`Found a route to handle this request:`, route]);

          if (params) {
            debugMessages.push([
              `Passing the following params to the route's handler:`,
              params
            ]);
          }
        }
      }

      // If we don't have a handler because there was no matching route, then
      // fall back to defaultHandler if that's defined.
      if (!handler && this._defaultHandler) {
        {
          debugMessages.push(
            `Failed to find a matching route. Falling ` +
              `back to the default handler.`
          );

          // This is used for debugging in logs in the case of an error.
          route = "[Default Handler]";
        }
        handler = this._defaultHandler;
      }

      if (!handler) {
        {
          // No handler so Workbox will do nothing. If logs is set of debug
          // i.e. verbose, we should print out this information.
          logger_mjs.logger.debug(
            `No route found for: ${getFriendlyURL_mjs.getFriendlyURL(url)}`
          );
        }
        return;
      }

      {
        // We have a handler, meaning Workbox is going to handle the route.
        // print the routing details to the console.
        logger_mjs.logger.groupCollapsed(
          `Router is responding to: ${getFriendlyURL_mjs.getFriendlyURL(url)}`
        );
        debugMessages.forEach(msg => {
          if (Array.isArray(msg)) {
            logger_mjs.logger.log(...msg);
          } else {
            logger_mjs.logger.log(msg);
          }
        });

        // The Request and Response objects contains a great deal of information,
        // hide it under a group in case developers want to see it.
        logger_mjs.logger.groupCollapsed(`View request details here.`);
        logger_mjs.logger.unprefixed.log(event.request);
        logger_mjs.logger.groupEnd();

        logger_mjs.logger.groupEnd();
      }

      // Wrap in try and catch in case the handle method throws a synchronous
      // error. It should still callback to the catch handler.
      let responsePromise;
      try {
        responsePromise = handler.handle({ url, event, params });
      } catch (err) {
        responsePromise = Promise.reject(err);
      }

      if (responsePromise && this._catchHandler) {
        responsePromise = responsePromise.catch(err => {
          {
            // Still include URL here as it will be async from the console group
            // and may not make sense without the URL
            logger_mjs.logger.groupCollapsed(
              `Error thrown when responding to: ` +
                ` ${getFriendlyURL_mjs.getFriendlyURL(
                  url
                )}. Falling back to Catch Handler.`
            );
            logger_mjs.logger.unprefixed.error(`Error thrown by:`, route);
            logger_mjs.logger.unprefixed.error(err);
            logger_mjs.logger.groupEnd();
          }
          return this._catchHandler.handle({ url, event, err });
        });
      }

      return responsePromise;
    }

    /**
     * Checks the incoming `event.request` against the registered routes, and if
     * there's a match, returns the corresponding handler along with any params
     * generated by the match.
     *
     * @param {FetchEvent} event
     * @param {URL} url
     * @return {Object} Returns an object with `handler` and `params` properties.
     * They are populated if a matching route was found or `undefined` otherwise.
     *
     * @private
     */
    _findHandlerAndParams(event, url) {
      const routes = this._routes.get(event.request.method) || [];
      for (const route of routes) {
        let matchResult = route.match({ url, event });
        if (matchResult) {
          if (Array.isArray(matchResult) && matchResult.length === 0) {
            // Instead of passing an empty array in as params, use undefined.
            matchResult = undefined;
          } else if (
            (matchResult.constructor === Object &&
              Object.keys(matchResult).length === 0) ||
            matchResult === true
          ) {
            // Instead of passing an empty object in as params, use undefined.
            matchResult = undefined;
          }

          // Break out of the loop and return the appropriate values as soon as
          // we have a match.
          return {
            route,
            params: matchResult,
            handler: route.handler
          };
        }
      }

      // If we didn't have a match, then return undefined values.
      return { handler: undefined, params: undefined };
    }

    /**
     * Define a default `handler` that's called when no routes explicitly
     * match the incoming request.
     *
     * Without a default handler, unmatched requests will go against the
     * network as if there were no service worker present.
     *
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */
    setDefaultHandler(handler) {
      this._defaultHandler = normalizeHandler(handler);
    }

    /**
     * If a Route throws an error while handling a request, this `handler`
     * will be called and given a chance to provide a response.
     *
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */
    setCatchHandler(handler) {
      this._catchHandler = normalizeHandler(handler);
    }

    /**
     * Registers a route with the router.
     *
     * @param {workbox.routing.Route} route The route to register.
     */
    registerRoute(route) {
      {
        assert_mjs.assert.isType(route, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });

        assert_mjs.assert.hasMethod(route, "match", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });

        assert_mjs.assert.isType(route.handler, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });

        assert_mjs.assert.hasMethod(route.handler, "handle", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.handler"
        });

        assert_mjs.assert.isType(route.method, "string", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.method"
        });
      }

      if (!this._routes.has(route.method)) {
        this._routes.set(route.method, []);
      }

      // Give precedence to all of the earlier routes by adding this additional
      // route to the end of the array.
      this._routes.get(route.method).push(route);
    }

    /**
     * Unregisters a route with the router.
     *
     * @param {workbox.routing.Route} route The route to unregister.
     */
    unregisterRoute(route) {
      if (!this._routes.has(route.method)) {
        throw new WorkboxError_mjs.WorkboxError(
          "unregister-route-but-not-found-with-method",
          {
            method: route.method
          }
        );
      }

      const routeIndex = this._routes.get(route.method).indexOf(route);
      if (routeIndex > -1) {
        this._routes.get(route.method).splice(routeIndex, 1);
      } else {
        throw new WorkboxError_mjs.WorkboxError(
          "unregister-route-route-not-registered"
        );
      }
    }
  }

  /*
   Copyright 2016 Google Inc. All Rights Reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

  /**
   * NavigationRoute makes it easy to create a [Route]{@link
   * workbox.routing.Route} that matches for browser
   * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
   *
   * It will only match incoming Requests whose
   * [`mode`]{@link https://fetch.spec.whatwg.org/#concept-request-mode}
   * is set to `navigate`.
   *
   * You can optionally only apply this route to a subset of navigation requests
   * by using one or both of the `blacklist` and `whitelist` parameters.
   *
   * @memberof workbox.routing
   * @extends workbox.routing.Route
   */
  class NavigationRoute extends Route {
    /**
     * If both `blacklist` and `whiltelist` are provided, the `blacklist` will
     * take precedence and the request will not match this route.
     *
     * The regular expressions in `whitelist` and `blacklist`
     * are matched against the concatenated
     * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
     * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
     * portions of the requested URL.
     *
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {Object} options
     * @param {Array<RegExp>} [options.blacklist] If any of these patterns match,
     * the route will not handle the request (even if a whitelist RegExp matches).
     * @param {Array<RegExp>} [options.whitelist=[/./]] If any of these patterns
     * match the URL's pathname and search parameter, the route will handle the
     * request (assuming the blacklist doesn't match).
     */
    constructor(handler, { whitelist = [/./], blacklist = [] } = {}) {
      {
        assert_mjs.assert.isArrayOfClass(whitelist, RegExp, {
          moduleName: "workbox-routing",
          className: "NavigationRoute",
          funcName: "constructor",
          paramName: "options.whitelist"
        });
        assert_mjs.assert.isArrayOfClass(blacklist, RegExp, {
          moduleName: "workbox-routing",
          className: "NavigationRoute",
          funcName: "constructor",
          paramName: "options.blacklist"
        });
      }

      super((...args) => this._match(...args), handler);

      this._whitelist = whitelist;
      this._blacklist = blacklist;
    }

    /**
     * Routes match handler.
     *
     * @param {Object} options
     * @param {FetchEvent} options.event
     * @param {URL} options.url
     * @return {boolean}
     *
     * @private
     */
    _match({ event, url }) {
      if (event.request.mode !== "navigate") {
        return false;
      }

      const pathnameAndSearch = url.pathname + url.search;

      if (this._blacklist.some(regExp => regExp.test(pathnameAndSearch))) {
        {
          logger_mjs.logger.debug(
            `The navigation route is not being used, since the ` +
              `request URL matches both the whitelist and blacklist.`
          );
        }
        return false;
      }

      if (this._whitelist.some(regExp => regExp.test(pathnameAndSearch))) {
        {
          logger_mjs.logger.debug(`The navigation route is being used.`);
        }
        return true;
      } else {
        {
          logger_mjs.logger.debug(
            `The navigation route is not being used, since the ` +
              `URL being navigated to doesn't match the whitelist.`
          );
        }
      }

      return false;
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

  var publicAPI = /*#__PURE__*/ Object.freeze({
    RegExpRoute: RegExpRoute,
    Route: Route,
    Router: Router,
    NavigationRoute: NavigationRoute
  });

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

  {
    assert_mjs.assert.isSwEnv("workbox-routing");
  }

  /**
   * @private
   */
  class DefaultRouter extends Router {
    /**
     * Easily register a RegExp, string, or function with a caching
     * strategy to the Router.
     *
     * This method will generate a Route for you if needed and
     * call [Router.registerRoute()]{@link
     * workbox.routing.Router#registerRoute}.
     *
     * @param {
     * RegExp|
     * string|
     * workbox.routing.Route~matchCallback|
     * workbox.routing.Route
     * } capture
     * If the capture param is a `Route`, all other arguments will be ignored.
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     * @return {workbox.routing.Route} The generated `Route`(Useful for
     * unregistering).
     *
     * @alias workbox.routing.registerRoute
     */
    registerRoute(capture, handler, method = "GET") {
      let route;

      if (typeof capture === "string") {
        const captureUrl = new URL(capture, location);

        {
          if (!(capture.startsWith("/") || capture.startsWith("http"))) {
            throw new WorkboxError_mjs.WorkboxError("invalid-string", {
              moduleName: "workbox-routing",
              className: "DefaultRouter",
              funcName: "registerRoute",
              paramName: "capture"
            });
          }

          // We want to check if Express-style wildcards are in the pathname only.
          // TODO: Remove this log message in v4.
          const valueToCheck = capture.startsWith("http")
            ? captureUrl.pathname
            : capture;
          // See https://github.com/pillarjs/path-to-regexp#parameters
          const wildcards = "[*:?+]";
          if (valueToCheck.match(new RegExp(`${wildcards}`))) {
            logger_mjs.logger.debug(
              `The '$capture' parameter contains an Express-style wildcard ` +
                `character (${wildcards}). Strings are now always interpreted as ` +
                `exact matches; use a RegExp for partial or wildcard matches.`
            );
          }
        }

        const matchCallback = ({ url }) => {
          {
            if (
              url.pathname === captureUrl.pathname &&
              url.origin !== captureUrl.origin
            ) {
              logger_mjs.logger.debug(
                `${capture} only partially matches the cross-origin URL ` +
                  `${url}. This route will only handle cross-origin requests ` +
                  `if they match the entire URL.`
              );
            }
          }

          return url.href === captureUrl.href;
        };

        route = new Route(matchCallback, handler, method);
      } else if (capture instanceof RegExp) {
        route = new RegExpRoute(capture, handler, method);
      } else if (typeof capture === "function") {
        route = new Route(capture, handler, method);
      } else if (capture instanceof Route) {
        route = capture;
      } else {
        throw new WorkboxError_mjs.WorkboxError("unsupported-route-type", {
          moduleName: "workbox-routing",
          className: "DefaultRouter",
          funcName: "registerRoute",
          paramName: "capture"
        });
      }

      super.registerRoute(route);
      return route;
    }

    /**
     * Register a route that will return a precached file for a navigation
     * request. This is useful for the
     * [application shell pattern]{@link https://developers.google.com/web/fundamentals/architecture/app-shell}.
     *
     * This method will generate a
     * [NavigationRoute]{@link workbox.routing.NavigationRoute}
     * and call
     * [Router.registerRoute()]{@link workbox.routing.Router#registerRoute}
     * .
     *
     * @param {string} cachedAssetUrl
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to precache cache name provided by
     * [workbox-core.cacheNames]{@link workbox.core.cacheNames}.
     * @param {Array<RegExp>} [options.blacklist=[]] If any of these patterns
     * match, the route will not handle the request (even if a whitelist entry
     * matches).
     * @param {Array<RegExp>} [options.whitelist=[/./]] If any of these patterns
     * match the URL's pathname and search parameter, the route will handle the
     * request (assuming the blacklist doesn't match).
     * @return {workbox.routing.NavigationRoute} Returns the generated
     * Route.
     *
     * @alias workbox.routing.registerNavigationRoute
     */
    registerNavigationRoute(cachedAssetUrl, options = {}) {
      {
        assert_mjs.assert.isType(cachedAssetUrl, "string", {
          moduleName: "workbox-routing",
          className: "[default export]",
          funcName: "registerNavigationRoute",
          paramName: "cachedAssetUrl"
        });
      }

      const cacheName = cacheNames_mjs.cacheNames.getPrecacheName(
        options.cacheName
      );
      const handler = () =>
        caches
          .match(cachedAssetUrl, { cacheName })
          .then(response => {
            if (response) {
              return response;
            }
            // This shouldn't normally happen, but there are edge cases:
            // https://github.com/GoogleChrome/workbox/issues/1441
            throw new Error(
              `The cache ${cacheName} did not have an entry for ` +
                `${cachedAssetUrl}.`
            );
          })
          .catch(error => {
            // If there's either a cache miss, or the caches.match() call threw
            // an exception, then attempt to fulfill the navigation request with
            // a response from the network rather than leaving the user with a
            // failed navigation.
            {
              logger_mjs.logger.debug(
                `Unable to respond to navigation request with cached ` +
                  `response: ${error.message}. Falling back to network.`
              );
            }

            // This might still fail if the browser is offline...
            return fetch(cachedAssetUrl);
          });

      const route = new NavigationRoute(handler, {
        whitelist: options.whitelist,
        blacklist: options.blacklist
      });
      super.registerRoute(route);

      return route;
    }
  }

  const router = new DefaultRouter();

  // By default, register a fetch event listener that will respond to a request
  // only if there's a matching route.
  self.addEventListener("fetch", event => {
    const responsePromise = router.handleRequest(event);
    if (responsePromise) {
      event.respondWith(responsePromise);
    }
  });

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

  const finalExport = Object.assign(router, publicAPI);

  return finalExport;
})(
  workbox.core._private,
  workbox.core._private,
  workbox.core._private,
  workbox.core._private,
  workbox.core._private
);

//# sourceMappingURL=workbox-routing.dev.js.map
