/**
 * Module dependencies.
 */
//  https://postcss.org/api/
var postcss = require("postcss");
var parser = require("postcss-value-parser");
var helpers = require("postcss-message-helpers");
var path = require("path");

var defaultOptions = {
  suffix: "-rgb",
  functions: "rgba?", // regexp string
};

/**
 * PostCSS plugin to transform css variable
 */
module.exports = postcss.plugin(
  "postcss-plugin-cssvar-mod",
  function (options) {
    options = Object.assign({}, defaultOptions, options);
    var functions = options.functions;
    var basePath = options.basePath;
    var include = options.include;
    var includeFiles = [];
    if (include && include.length) {
      if (!basePath) {
        console.error("需传入 basePath ");
        return;
      }
      includeFiles = include.map(function (file) {
        return path.join(basePath, file);
      });
    }

    var res = [];
    return function (style, result) {
      var file = style.source.input.file;
      // only deal with include files when includeFiles exists
      if (includeFiles.length && includeFiles.indexOf(file) === -1) {
        return;
      }

      style.walkDecls(function (decl) {
        var value = decl.value;
        if (
          !value ||
          !new RegExp(functions + "\\(").test(value) ||
          value.indexOf("var(") === -1
        ) {
          return;
        }

        try {
          decl.value = helpers.try(function () {
            return transform(value, options, res);
          }, decl.source);
        } catch (error) {
          decl.warn(result, error.message, {
            word: value,
            index: decl.index,
          });
        }
      });

      options.onFinish && options.onFinish(res);
    };
  }
);

function transform(string, options, res) {
  // https://www.npmjs.com/package/postcss-value-parser
  return parser(string)
    .walk(function (node) {
      if (
        node.type !== "function" ||
        !new RegExp(options.functions).test(node.value)
      ) {
        return;
      }

      var varNode =
        node.nodes &&
        node.nodes.find(
          (item) => item.type === "function" && item.value === "var"
        );
      if (varNode && varNode.nodes) {
        var wordNode = varNode.nodes[0];
        if (
          wordNode &&
          wordNode.type === "word" &&
          !wordNode.value.endsWith(options.suffix)
        ) {
          var oldValue = wordNode.value;
          var newValue = wordNode.value + options.suffix;
          if (!res.map((i) => i.oldValue).includes(oldValue)) {
            res.push({
              oldValue: oldValue,
              newValue: newValue,
            });
          }
          wordNode.value = newValue;
        }
      }
    })
    .toString();
}
