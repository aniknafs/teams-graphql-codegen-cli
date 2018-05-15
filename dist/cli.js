'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (((f = 1), y && (t = y[op[0] & 2 ? 'return' : op[0] ? 'throw' : 'next']) && !(t = t.call(y, op[1])).done))
            return t;
          if (((y = 0), t)) op = [0, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var _this = this;
Object.defineProperty(exports, '__esModule', { value: true });
var commander = require('commander');
var introspection_from_file_1 = require('./loaders/introspection-from-file');
var introspection_from_url_1 = require('./loaders/introspection-from-url');
var schema_from_export_1 = require('./loaders/schema-from-export');
var documents_glob_1 = require('./utils/documents-glob');
var graphql_codegen_compiler_1 = require('graphql-codegen-compiler');
var graphql_codegen_core_1 = require('graphql-codegen-core');
var document_loader_1 = require('./loaders/document-loader');
var path = require('path');
var fs = require('fs');
var templates_scanner_1 = require('./loaders/templates-scanner');
var graphql_codegen_generators_1 = require('graphql-codegen-generators');
var mkdirp = require('mkdirp');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
function collect(val, memo) {
  memo.push(val);
  return memo;
}
exports.initCLI = function(args) {
  commander
    .usage('gql-gen [options]')
    .option('-f, --file <filePath>', 'Parse local GraphQL introspection JSON file')
    .option('-u, --url <graphql-endpoint>', 'Parse remote GraphQL endpoint as introspection file')
    .option(
      '-u, --export <export-file>',
      'Path to a JavaScript (es5/6) file that exports (as default export) your `GraphQLSchema` object'
    )
    .option('-h, --header [header]', 'Header to add to the introspection HTTP request when using --url', collect, [])
    .option(
      '-t, --template <template-name>',
      'Language/platform name templates, or a name of NPM modules that `export default` GqlGenConfig object'
    )
    .option('-p, --project <project-path>', 'Project path(s) to scan for custom template files')
    .option('--config <json-file>', 'Codegen configuration file, defaults to: ./gql-gen.json')
    .option('-m, --no-schema', 'Generates only client side documents, without server side schema types')
    .option('-c, --no-documents', 'Generates only server side schema types, without client side documents')
    .option('-o, --out <path>', 'Output file(s) path', String, './')
    .option('-r, --require [require]', 'module to preload (option can be repeated)', collect, [])
    .option('-ow, --no-overwrite', 'Skip file writing if the output file(s) already exists in path')
    .arguments('<options> [documents...]')
    .parse(args);
  return commander;
};
exports.cliError = function(err) {
  if (typeof err === 'object') {
    console.log(err);
  }
  console.error('Error: ' + err);
  process.exit(1);
  return;
};
exports.validateCliOptions = function(options) {
  var file = options.file;
  var url = options.url;
  var fsExport = options.export;
  var template = options.template;
  var project = options.project;
  if (!file && !url && !fsExport) {
    exports.cliError('Please specify one of --file, --url or --export flags!');
  }
  if (!template && !project) {
    exports.cliError(
      'Please specify language/platform, using --template flag, or specify --project to generate with custom project!'
    );
  }
};
exports.executeWithOptions = function(options) {
  return __awaiter(_this, void 0, void 0, function() {
    var file,
      url,
      fsExport,
      documents,
      template,
      project,
      gqlGenConfigFilePath,
      out,
      headers,
      generateSchema,
      generateDocuments,
      modulesToRequire,
      schemaExportPromise,
      graphQlSchema,
      context,
      transformedDocuments,
      _a,
      _b,
      _c,
      templateConfig,
      templateFromExport,
      configPath,
      config,
      templates,
      resolvedHelpers_1;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          exports.validateCliOptions(options);
          file = options.file;
          url = options.url;
          fsExport = options.export;
          documents = options.args || [];
          template = options.template;
          project = options.project;
          gqlGenConfigFilePath = options.config || './gql-gen.json';
          out = options.out || './';
          headers = options.header;
          generateSchema = options.schema;
          generateDocuments = options.documents;
          modulesToRequire = options.require || [];
          modulesToRequire.forEach(function(mod) {
            return require(mod);
          });
          if (file) {
            schemaExportPromise = introspection_from_file_1
              .introspectionFromFile(file)
              .then(graphql_codegen_core_1.introspectionToGraphQLSchema);
          } else if (url) {
            schemaExportPromise = introspection_from_url_1
              .introspectionFromUrl(url, headers)
              .then(graphql_codegen_core_1.introspectionToGraphQLSchema);
          } else if (fsExport) {
            schemaExportPromise = schema_from_export_1.schemaFromExport(fsExport);
          }
          return [4 /*yield*/, schemaExportPromise];
        case 1:
          graphQlSchema = _d.sent();
          if (process.env.VERBOSE !== undefined) {
            console.log('GraphQL Schema is: ', graphQlSchema);
          }
          context = graphql_codegen_core_1.schemaToTemplateContext(graphQlSchema);
          graphql_codegen_core_1.debugLog('[executeWithOptions] Schema template context build, the result is: ');
          Object.keys(context).forEach(function(key) {
            if (Array.isArray(context[key])) {
              graphql_codegen_core_1.debugLog('Total of ' + key + ': ' + context[key].length);
            }
          });
          _a = graphql_codegen_core_1.transformDocument;
          _b = [graphQlSchema];
          _c = document_loader_1.loadDocumentsSources;
          return [4 /*yield*/, documents_glob_1.documentsFromGlobs(documents)];
        case 2:
          transformedDocuments = _a.apply(void 0, _b.concat([_c.apply(void 0, [_d.sent()])]));
          templateConfig = null;
          if (template && template !== '') {
            graphql_codegen_core_1.debugLog('[executeWithOptions] using template: ' + template);
            templateConfig = graphql_codegen_generators_1.getGeneratorConfig(template);
            if (!templateConfig) {
              templateFromExport = require(template);
              if (!templateFromExport || !templateFromExport.default) {
                throw new Error('Unknown template: ' + template);
              } else {
                templateConfig = templateFromExport.default;
              }
            }
          }
          graphql_codegen_core_1.debugLog('[executeWithOptions] using project: ' + project);
          configPath = path.resolve(process.cwd(), gqlGenConfigFilePath);
          config = null;
          if (fs.existsSync(configPath)) {
            console.log('Loading config file from: ', configPath);
            config = JSON.parse(fs.readFileSync(configPath).toString());
            graphql_codegen_core_1.debugLog('[executeWithOptions] Got project config JSON: ', config);
          }
          if (project && project !== '') {
            if (config === null) {
              throw new Error(
                'To use project feature, please specify --config path or create gql-gen.json in your project root!'
              );
            }
            templates = templates_scanner_1.scanForTemplatesInPath(
              project,
              graphql_codegen_compiler_1.ALLOWED_CUSTOM_TEMPLATE_EXT
            );
            resolvedHelpers_1 = {};
            Object.keys(config.customHelpers || {}).map(function(helperName) {
              var filePath = config.customHelpers[helperName];
              var resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
              if (fs.existsSync(resolvedPath)) {
                var requiredFile = require(resolvedPath);
                if (requiredFile && requiredFile && typeof requiredFile === 'function') {
                  resolvedHelpers_1[helperName] = requiredFile;
                } else {
                  throw new Error('Custom template file ' + resolvedPath + ' does not have a default export function!');
                }
              } else {
                throw new Error('Custom template file ' + helperName + ' does not exists in path: ' + resolvedPath);
              }
            });
            templateConfig = {
              inputType: graphql_codegen_generators_1.EInputType.PROJECT,
              templates: templates,
              flattenTypes: config.flattenTypes,
              primitives: config.primitives,
              customHelpers: resolvedHelpers_1
            };
          }
          templateConfig.config = config ? config.generatorConfig || {} : {};
          return [
            2 /*return*/,
            graphql_codegen_compiler_1
              .compileTemplate(templateConfig, context, [transformedDocuments], {
                generateSchema: generateSchema,
                generateDocuments: generateDocuments
              })
              .map(function(item) {
                var resultName = item.filename;
                if (!path.isAbsolute(resultName)) {
                  var resolved = path.resolve(process.cwd(), out);
                  if (fs.existsSync(resolved)) {
                    var stats = fs.lstatSync(resolved);
                    if (stats.isDirectory()) {
                      resultName = path.resolve(resolved, item.filename);
                    } else if (stats.isFile()) {
                      resultName = resolved;
                    }
                  } else {
                    if (out.endsWith('/')) {
                      resultName = path.resolve(resolved, item.filename);
                    } else {
                      resultName = resolved;
                    }
                  }
                }
                var resultDir = path.dirname(resultName);
                mkdirp.sync(resultDir);
                return {
                  content: item.content,
                  filename: resultName
                };
              })
          ];
      }
    });
  });
};
//# sourceMappingURL=cli.js.map
