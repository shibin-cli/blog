---
title: requirejs使用
tag: 工具
categories: 
- 前端
tags: 
- 模块化开发 
- JavaScript
---
首先[下载requirejs](https://requirejs.org/docs/download.html)或直接引用cdn

[官方文档](https://requirejs.org/) 

[阮一峰的网络日志](https://www.ruanyifeng.com/blog/2012/11/require_js.html)

下面部分内容是看了阮一峰大神的文章后写的
## 引入requirejs
``` html
<script src="https://cdn.jsdelivr.net/npm/requirejs@2.3.6/require.js"></script>
```
也可以这样引入，data-main属性的作用是，指定网页程序的主模块。require.js默认的文件后缀名是js，.js后缀可以不写
``` html
<script src="https://cdn.jsdelivr.net/npm/requirejs@2.3.6/require.js" data-main="js/main"></script>
```
主模块的写法
``` js
require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC) {

    // some code here

});
```
require函数接收两个参数
* 第一个参数是所依赖的模块，类型是数组
* 第二个参数是回调函数，引入的所有模块加载成功后会执行
  * 回调函数所对应的参数依次对应所导入的模块

## 模块的加载
require.config
* 可以对模块的加载行为进行自定义。
* 参数是个对象
  * paths 
    * 指定各个模块的加载路径
    * 模块路径也可以是个网址
  * baseUrl 指定模块的根路径
``` js
require.config({
    paths: {
        "jquery": "jquery.min",
        "underscore": "underscore.min",
        "backbone": "backbone.min"
    }
});
```
 指定模块的根路径
```js
require.config({
    //  指定模块的根路径
    baseUrl: "js/lib",
    paths: {
        "jquery": "jquery.min",
        "underscore": "underscore.min",
        "backbone": "backbone.min"
    }
});
```
模块路径也可以是个网址
``` js
require.config({
    paths: {
        // 模块路径也可以是个网址
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min"
    }
});
```
require.js要求，每个模块是一个单独的js文件。这样的话，如果加载多个模块，就会发出多次HTTP请求，会影响网页的加载速度。因此，require.js提供了一个优化工具，当模块部署完毕以后，可以用这个工具将多个模块合并在一个文件中，减少HTTP请求数。

## AMD模块的写法
require.js加载的模块，采用AMD规范。

模块必须采用特定的define方法来定义
``` js
// math.js
define(function () {
    var add = function (x, y) {
        return x + y;
    };

    return {
        add: add
    };

});
```
加载模块
```js
require(['math'], function (math){
    console.log(math.add(1,1));
});
```
当依赖其他模块时，define函数的第一个参数，就是所依赖的模块且必须是一个数组
## CMD模块写法
requirejs兼容了CMD规范的写法（类CommonJS的写法）

声明模块，写法1
```js
define(function (require, exports, module) {
    exports.add = (a, b) => {
        return a + b
    }
});
```
写法2
``` js
define(function (require, exports, module) {
    module.exports = (a, b) => {
        return a + b
    }
});
```
依赖项的模块
```js
define("foo/title",
    ["my/cart", "my/inventory"],
    function(cart, inventory) {
        //Define foo/title object in here.
    }
);
```
导入模块
``` js
define(function(require, exports, module) {
        var a = require('a'),
            b = require('b');

        //Return the module value
        return function () {};
    }
);
```
