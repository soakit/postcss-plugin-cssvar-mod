# postcss-plugin-cssvar-mod

简体中文 | [English](README.en.md)

给 rgb(a)函数中的 css 变量值加入后缀。

## 使用

1. 安装

   ```shell
   npm i postcss-plugin-cssvar-mod
   ```

2. 调用

   ```js
   const postcss = require("postcss");
   const plugin = require("postcss-plugin-cssvar-mod");

   const options = {};
   postcss().use(plugin(options));
   ```

   调用前

   ```css
   .test1 {
     color: rgb(var(--theme-color));
   }
   ```

   调用后

   ```css
   .test1 {
     color: rgb(var(--theme-color-rgb));
   }
   ```

## 选项说明

| 选项      | 说明                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| suffix    | 变量值的后缀值，默认是`-rgb`                                                                                            |
| functions | 函数名的正则字符串，默认是`rgba?`                                                                                       |
| include   | 文件路径数组                                                                                                            |
| basePath  | 文件的基准目录                                                                                                          |
| onFinish  | 处理完成后的回调，参数是处理的 css 变量值的去重数组。如`[{ oldValue: '--theme-color', newValue: '--theme-color-rgb' }]` |
