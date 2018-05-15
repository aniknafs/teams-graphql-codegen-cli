'use strict';
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var graphql_codegen_core_1 = require('graphql-codegen-core');
var request = require('request');
exports.introspectionFromUrl = function(url, headers) {
  console.log('Loading GraphQL Introspection from remote: ' + url + '...');
  var splittedHeaders = (headers || [])
    .map(function(header) {
      var result = header.match(/^(.*?)[:=]{1}(.*?)$/);
      if (result && result.length > 0) {
        var name = result[1];
        var value = result[2];
        return (_a = {}), (_a[name] = value), _a;
      }
      return null;
      var _a;
    })
    .filter(function(item) {
      return item;
    });
  var extraHeaders = __assign(
    { Accept: 'application/json', 'Content-Type': 'application/json' },
    splittedHeaders.reduce(function(prev, item) {
      return __assign({}, prev, item);
    }, {})
  );
  graphql_codegen_core_1.debugLog('Executing POST to ' + url + ' with headers: ', extraHeaders);
  return new Promise(function(resolve, reject) {
    request.post(
      {
        url: url,
        json: {
          query: graphql_codegen_core_1.introspectionQuery.replace('locations', '')
        },
        headers: extraHeaders
      },
      function(err, response, body) {
        if (err) {
          reject(err);
          return;
        }
        var bodyJson = body.data;
        if (!bodyJson || (body.errors && body.errors.length > 0)) {
          reject(
            'Unable to download schema from remote: ' +
              body.errors
                .map(function(item) {
                  return item.message;
                })
                .join(', ')
          );
          return;
        }
        resolve(bodyJson);
      }
    );
  });
};
//# sourceMappingURL=introspection-from-url.js.map
