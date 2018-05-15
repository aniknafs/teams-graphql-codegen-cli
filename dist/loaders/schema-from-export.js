'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var path = require('path');
var graphql_1 = require('graphql');
exports.schemaFromExport = function(file) {
  console.log(
    'Loading GraphQL schema object, text, ast, or introspection json from JavaScript ES6 export: ' + file + '...'
  );
  return new Promise(function(resolve, reject) {
    var fullPath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      try {
        var exports_1 = require(fullPath);
        if (exports_1) {
          var schema = exports_1.default || exports_1.schema;
          if (schema) {
            if (isSchemaObject(schema)) {
              resolve(schema);
            } else if (isSchemaAst(schema)) {
              resolve(graphql_1.buildASTSchema(schema));
            } else if (isSchemaText(schema)) {
              var ast = graphql_1.parse(schema);
              resolve(graphql_1.buildASTSchema(ast));
            } else if (isSchemaJson(schema)) {
              resolve(graphql_1.buildClientSchema(schema.data));
            } else {
              reject('Exported schema must be of type GraphQLSchema, text, AST, or introspection JSON.');
            }
          } else {
            reject(
              new Error('Invalid export from export file ' + fullPath + ": missing default export or 'schema' export!")
            );
          }
        } else {
          reject(new Error('Invalid export from export file ' + fullPath + ': empty export!'));
        }
      } catch (e) {
        reject(e);
      }
    } else {
      reject('Unable to locate introspection from export file: ' + fullPath);
    }
  });
};
function isSchemaText(obj) {
  return typeof obj === 'string';
}
function isSchemaJson(obj) {
  var json = obj;
  return json.data !== undefined && json.data.__schema !== undefined;
}
function isSchemaObject(obj) {
  return obj instanceof graphql_1.GraphQLSchema;
}
function isSchemaAst(obj) {
  return obj.kind !== undefined;
}
//# sourceMappingURL=schema-from-export.js.map
