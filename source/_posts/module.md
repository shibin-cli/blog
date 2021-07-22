---
title: JS模块化开发
date: 2021-07-10
categories: 
- 前端
tags: 
- 模块化开发 
- JavaScript
---
## 模块化开发的演变过程
### 按文件划分
* 每个功能单独放在不同的文件中
* 所有模块都在全局去工作，完全依赖约定存在
  * 污染全局作用域
  * 命名冲突
  * 无法管理模块的依赖关系
### 命名空间方式
* 每个模块暴露一个全局对象，所有模块成员都挂载到对象中
* 虽然减少了全局污染，但是全局污染、命名冲突、依赖关系依然没有解决
### 立即执行函数（IIFE）
* 实现了内部私有的成员
* 通过传参传入依赖项

``` js
(function($){
    ...
    window.xxx = {
        xxx:...
    }
})(jq)
```
### [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88)
异步模块定义规范，通过异步方式加载模块，模块加载不影响后面代码执行，所有依赖模块执行的代码，放在回调函数中，异步模块加载完毕后会执行回调函数
``` js
require([module]callback)
```
目前主要有两个JavaScript库实现了AMD规范 [requireJs](https://requirejs.org/) 和[cur](https://github.com/cujojs/curl)

存在问题
* 需要引入第三方库，增加额外的代码
* 请求js文件频繁
### CommonJS
* 每个模块是单独的文件
* 每个模块的有自己的作用域
* 通过module.exports导出模块；通过require导入模块，后缀名默认为.js，多次require
* 加载模块是同步的

http://javascript.ruanyifeng.com/nodejs/module.html

由于CommonJS是同步的，所以不适合浏览器环境，在node环境中，模块都是本地文件，加载速度比较快
### CMD(sea.js )
类似CommonJS规范，后来被requirejs兼容了
``` js
define(function(require, exports, module) {
    // 模块代码
});
```
### ES Modules
* 标准化的Module特性
* 自动使用严格模式
* export 导出，import导入
  * export导出的不是对象，而是特定的代码
  * import 导入只会加载导入的方法，没有导入的方法不会加载
  * 编译时加载
* 每个文件都有自己单独的作用域
## 模块标椎规范
* NodeJS 采用CommonJS规范
* 浏览器采用ES Modules

## ES Mudules
