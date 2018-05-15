'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var path = require('path');
exports.introspectionFromFile = function(file) {
  console.log('Loading GraphQL Introspection from file: ' + file + '...');
  return new Promise(function(resolve, reject) {
    var fullPath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      try {
        var fileContent = fs.readFileSync(fullPath, 'utf8');
        if (!fileContent) {
          reject('Unable to read local introspection file: ' + fullPath);
        }
        var introspection = JSON.parse(fileContent);
        if (introspection.data) {
          introspection = introspection.data;
        }
        resolve(introspection);
      } catch (e) {
        reject(e);
      }
    } else {
      reject('Unable to locate local introspection file: ' + fullPath);
    }
  });
};
//# sourceMappingURL=introspection-from-file.js.map
