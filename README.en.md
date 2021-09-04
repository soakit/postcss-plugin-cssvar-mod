# postcss-plugin-cssvar-mod

English | [简体中文](README.md)

Add a suffix to the value of the css variable in the rgb(a) function.

## Start

1. Install

   ```shell
   npm i postcss-plugin-cssvar-mod
   ```

2. Call

   ```js
   const postcss = require("postcss");
   const plugin = require("postcss-plugin-cssvar-mod");

   const options = {};
   postcss().use(plugin(options));
   ```

   before

   ```css
   .test1 {
     color: rgb(var(--theme-color));
   }
   ```

   after

   ```css
   .test1 {
     color: rgb(var(--theme-color-rgb));
   }
   ```

## Options API

| Options   | Description                                                                                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| suffix    | The suffix value of the variable value, the default is `-rgb`                                                                                                                                       |
| functions | The regular string of the function name, the default is `rgba?`                                                                                                                                     |
| include   | Array of file paths                                                                                                                                                                                 |
| basePath  | Base path of files                                                                                                                                                                                  |
| onFinish  | The callback after the processing is completed, the parameter is the de-duplication array of the processed css variable value. like`[{ oldValue: '--theme-color', newValue: '--theme-color-rgb' }]` |
