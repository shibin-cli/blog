---
title: jsdoc
tag: 工具
categories: 
- 开发工具
---
类型注释  https://jsdoc.app/
```js
/**
 * @param  {number} a param1
 * @param  {number} b param2
 * @returns {number} 
 * */
function fn(a, b) {
    return a + b
}

let a = fn()
```

常见的类型注释
* `@type`  变量类型
* `@param`(或`@params`或`@argument`) 参数类型
* `returns`(或`returns`) 返回值类型
* `typedef` 相当于ts中的`type Status = "open" | "close"`
* `@callback` 回调函数  https://jsdoc.app/tags-callback.html
* `@template`
* `@class`（`@constructor`）
* `@this`  函数内部this指向
* `@extends`(`@arguments`)
* `enum`

```js
/**@typedef {'open'|'close'} Status */

/**@type {Status} */
const a = 'close'
```

在webpack中使用
```js
/** @type {import('webpack').Configuration} */
module.exports = {
    ...
}
```