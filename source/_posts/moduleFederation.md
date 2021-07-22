---
title: 如何使用模块联邦落地微前端
date: 2021-07-09
categories: 
- 前端
tags: 
- 模块化开发 
- 微前端
---
目前微前端的落地方案
* 自组织模式
* 基座模式
* 模块加载模式

模块加载模式没有中心容器，可以将任意一个微应用当做项目入口，微应用与微应用之间相互串联，这种模式也叫做**去中心化模式**

webpack5引进了[Module Federation](https://webpack.docschina.org/concepts/module-federation/)（模块联邦，简称mf），mf 实际想要做的事，便是把多个无相互依赖、单独部署的应用合并为一个。一个模块既可以导出给其他模块使用，又可以导入一个其他模块

无论是 [single-spa](https://zh-hans.single-spa.js.org/docs/getting-started-overview) 还是 [qiankun](https://qiankun.umijs.org/zh/guide)，加载不同模块，都需要有一个容器中心来承载，而在 mf 中，没有且也不需要容器中心（每个应用都可以导出又导入）

## Module Federation在webpack中的使用

项目A，导出应用
``` js 
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Mfp = require('webpack').container.ModuleFederationPlugin

module.exports = {
    entry: './src/main.js',
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'dist1')
    },
    mode: 'development', 

    devServer: {
        port: 3001,
    },
    //  插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new Mfp({
            // 对外提供的打包后的⽂件名（引⼊时使⽤）
            filename: 'em.js',
            // 当前微应⽤名称
            name: 'em',
            // 暴露的应用内具体模块
            exposes: {
                // 名称： 代码路径
                './exposesModule': './src/exposesModule.js',
            }
        })

    ]
}
```
在项目A的导出文件中提供了一个方法
``` js
export function sum(a, b) {
    return a + b
}
```
项目B，导入应用
``` js
// 项目B
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Mfp = require('webpack').container.ModuleFederationPlugin

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'dist2')
    },
    devServer: {
        port: 3002,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new Mfp({
            // 导⼊模块
            remotes: {
                // 导⼊后给模块起个别名：“微应⽤名称@地址/导出的⽂件名”
                appone: 'em@http://localhost:3001/em.js'
            }
        })
    ]
}
```
项目B中使用项目A中提供的方法
```js
import('appone/exposesModule').then(res => {
    console.log(res.sum(1,2))
})
```
启动两个项目后，可以看到控制台会打印出3这个结果

项目A，打包后会生成
```
bundle.js 
em.js  对外提供的打包后的⽂件，代码中会导入 src_exposesModule_js.bundle.js
index.html
src_exposesModule_js.bundle.js  提供具体模块的文件
```
项目B会生成
```
bundle.js  代码中会导入http://localhost:3001/em.js，也就是上面的em.js文件
index.html
```
就这样，实现了项目B导入项目A中的模块

通过 Module Federation，任意的一个应用都可以作为微应用，为其他应用提供模块，增加了项目的灵活性，但没有统一的基座中心，每个应用维护就非常重要，增加了开发的难度。在项目数量庞大的情况下，管理成本就会提升。