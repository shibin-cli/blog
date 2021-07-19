---
title: Rollup
tag: 工具
date: 2021-07-18
categories: 
- 前端
tags: 
- 模块化开发 
- JavaScript
---
## rollup的基本使用
[Rollup](https://www.rollupjs.com/)是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码,Rollup 对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中
``` bash
npm i rollup -D
```
使用rollup编译文件

浏览器环境
``` bash
rollup main.js --file bundle.js --format iife
```
编译node
``` bash
rollup main.js --file bundle.js --format cjs
```
使用rollup配置文件
``` js
export default {
    // 入口文件
    input: 'src/main.js',
    output: {
        // 输出文件
        file: 'dist/bundle.js',
        // 输出文件的格式
        format: 'iife'
    }
}
```
## Rollup插件
插件是Rollup唯一的拓展途径

下面以```rollup-plugin-json```为例
``` diff
+ import json from 'rollup-plugin-json'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
+    plugins:[
+        json()
+    ]
}
```
### 使用rollup加载npm模块

rollup默认只支持路径加载，可以通过使用`@rollup/plugin-node-resolve`像webpack一样通过模块名称倒入模块
``` diff
+ import resolve from '@rollup/plugin-node-resolve'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins:[
+        resolve()
    ]
}
```
### 使rollup支导入commonjs模块
``` diff
+ import commonjs from '@rollup/plugin-commonjs'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins:[
+        commonjs()
    ]
}
```
### 代码拆分
Rollup已经支持动态导入
``` js
import('./a').then({sum} => {
    console.log(sum)
})
```
**注意**，这里**umd**和**iife**不支持代码拆分
``` js
export default {
    input: 'src/main.js',
    output: {
        format: 'amd',
        dir: 'dist'
    }
}
```

### 多入口打包
``` js
export default {
    input: ['src/a.js', 'src/b.js'],
    output: {
        format: 'amd',
        dir: 'dist'
    }
}
```

``` js
export default {
    input: {
        main: './a.js',
        b: './b.js'
    },
    output: {
        format: 'amd',
        dir: 'dist'
    }
}
```
## Rollup选用原则
* 加载非ESM的第三方模块比较复杂
* 浏览器环境中，代码拆分功能依赖AMD库（代码拆分不支持UMD和IIFE）