var fs = require("fs");
var path = require("path");

var test = require("tape");
var postcss = require("postcss");
var plugin = require("..");
var test4Res = require("./test4/index.result");

function compareFixtures(t, name, msg, dir, opts = {}, postcssOpts = {}) {
  postcssOpts.from = filename(dir + "/" + name);
  var actual = postcss()
    .use(plugin(opts))
    .process(read(postcssOpts.from), postcssOpts).css;
  var expected = read(filename(dir + "/" + name + ".expected"));
  fs.writeFileSync(filename(dir + "/" + name + ".actual"), actual);
  t.equal(actual, expected, msg);
}

test("正确添加css变量后缀", function (t) {
  compareFixtures(t, "color", "操作成功", "test1");
  t.end();
});

test("使用自定义的后缀", function (t) {
  compareFixtures(t, "color", "操作成功", "test2", {
    suffix: "-whatever",
  });
  t.end();
});

test("正确处理文件", function (t) {
  const options = {
    basePath: path.resolve(__dirname, "./test3"),
    include: ["./index.css"],
  };
  compareFixtures(t, "index", "操作成功", "test3", options);
  compareFixtures(t, "app", "操作成功", "test3", options);
  t.end();
});

test("测试回调", function (t) {
  const options = {
    basePath: path.resolve(__dirname, "./test4"),
    include: ["./index.css"],
    onFinish: function (res) {
        t.deepEqual(res, test4Res, "回调结果正确");
    },
  };
  compareFixtures(t, "index", "操作成功", "test4", options);
  t.end();
});

function filename(name) {
  return "test/" + name + ".css";
}

function read(name) {
  return fs.readFileSync(name, "utf8");
}
