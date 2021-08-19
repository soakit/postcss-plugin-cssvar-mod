/**
 * Module dependencies.
 */
//  https://postcss.org/api/
const postcss = require("postcss");
const parser = require("postcss-value-parser");
const helpers = require("postcss-message-helpers");
const path = require("path");

const defaultOptions = {
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
    const functions = options.functions;
    const basePath = options.basePath;
    const include = options.include;
    let includeFiles = [];
    if (include && include.length) {
      if (!basePath) {
        console.error("需传入 basePath ");
        return;
      }
      includeFiles = include.map(function (file) {
        return path.join(basePath, file);
      });
    }

    const res = [];
    return function (style, result) {
      const file = style.source.input.file;
      // only deal with include files when includeFiles exists
      if (includeFiles.length && !includeFiles.includes(file)) {
        return;
      }

      style.walkDecls(function (decl) {
        const value = decl.value;
        if (
          !value ||
          !new RegExp(functions + "\\(").test(value) ||
          !value.includes("var(")
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

      const varNode =
        node.nodes &&
        node.nodes.find(
          (item) => item.type === "function" && item.value === "var"
        );
      if (varNode && varNode.nodes) {
        const wordNode = varNode.nodes[0];
        if (
          wordNode &&
          wordNode.type === "word" &&
          !wordNode.value.endsWith(options.suffix)
        ) {
          const oldValue = wordNode.value;
          const newValue = wordNode.value + options.suffix;
          if (!res.some((i) => i.oldValue === oldValue)) {
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
