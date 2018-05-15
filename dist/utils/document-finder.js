'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var stripComments = require('strip-comments');
var graphql_codegen_core_1 = require('graphql-codegen-core');
exports.extractDocumentStringFromCodeFile = function(fileContent) {
  try {
    var parsed = graphql_codegen_core_1.parse(fileContent);
    if (parsed) {
      return fileContent;
    }
  } catch (e) {
    try {
      fileContent = stripComments(fileContent);
    } catch (e) {
      // nothing to to here
    }
    var matches = fileContent.match(/gql[(]?[`'"]([\s\S\n\r.]*?)[`'"][)]?/gm);
    if (matches === null) {
      matches = fileContent.match(/(['"](query|subscription|fragment|mutation) .*?['"])/gm);
    }
    var result = (matches || [])
      .map(function(item) {
        return item.replace(/\$\{.*?\}/g, '').replace(/(gql|`)/g, '');
      })
      .join();
    if (!result || result === '') {
      return null;
    } else {
      return result;
    }
  }
};
//# sourceMappingURL=document-finder.js.map
