---
title: 脚手架
tag: 工具
date: 2021-01-10
categories: 
- 前端
---
## 脚手架的本质作用
创建项目的基础解构、提供项目规范和约定
* 相同的组织结构
* 相同的开发方式
* 相同的模块依赖
* 相同的工具配置
* 相同的基础代码

常用的脚手架工具
* 根据信息创建对应的项目基础结构（create-app、vue-cli）
* Yeoman
* Plop(例如创建一个组件、模块所需的文件)
## Yeoman
安装[yeoman](https://yeoman.io/)
``` bash
npm install yo -g
```
安装generator
``` bash
# 安装对应的generator
npm install generator-node -g
# 运行脚手架
yo node
# 创建cli文件
yo node:cli
```
### 自定义generator
![generator基本结构](https://gitee.com/shibin1/fed-e-task-02-01/raw/master/note/img/2.jpg)

Yeoman的Generator模块名称必须是`generator-<name>`

首先创建对应的项目结构
```bash
npm install yeoman-generator
```
`generators/app.js`
```js
const Generator = require('yeoman-generator')
/**
 * 此文件为Generator的入口文件
 * 需要导出一个继承自yeoman-generator的类型
 * 在工作时会自动调用我们在此声明的一些生命周期方法
 */
module.exports = class extends Generator {
    //生成文件时会调用此方法
    wriging() {
        this.fs.write(
            this.destinationPath('test.txt'),
            Math.random().toString()
        )
    }
}
```
然后执行
```bash
npm link
yo <name>
```
创建模板文件夹` generators/app/teplates`，该文件夹用于存放模板文件，模板为ejs模板
```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    wriging() {
        // 对应模板文件夹下的index.html
        const tpl = this.templatePath('index.html')
        const ctx = { title: 'Yeoman', content: 'Yeoman is great!' }
        const output = this.destinationPath('index.html')
        this.fs.copyTpl(tpl, output, ctx)
    }
}
```
接收用户输入
```js
module.exports = class extends Generator {
    // 用于接收用户输入
    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'title',
            message: 'Your title',
            default: this.appname
        }, {
            type: 'input',
            name: 'content',
            message: 'Your content',
            default: this.appname
        }]).then(answers => {
            console.log(answers)
            this.answers = answers
        })
    }
    //生成文件时会调用此方法
    wriging() {
        // 对应模板文件夹下的index.html
        const tpl = this.templatePath('index.html')
        const ctx = this.answers
        const output = this.destinationPath('index.html')
        this.fs.copyTpl(tpl, output, ctx)
    }
}
```
## Plop

* 将[plop](https://github.com/plopjs/plop)模块作为项目开发依赖安装
* 在项目根目录下创建一个plopfile.js文件,定义脚手架任务
* 编写用于生成特定类型文件的模板
* 通过Plop提供的CLI运行脚手架服务

```bash
npm install plop --save-dev
```

plopfile.js

```js
module.exports = plop=>{
    plop.setGenerator('component',{
        description: 'create a component',
        prompts:[{
            type:'input',
            name:'name',
            message:'Component name',
            default:'MyComponent'
        }],
        actions:[{
            type:'add',
            path:'src/components/{{name}}/{{name}}.js',
            templateFile:'templates/component.hbs'
        }]
    })
}
```
## 脚手架的工作原理
创建项目,在package.json文件中指定bin(指定cli的入口文件)

```js
{
    "bin" :"cli.js"
}
```

cli.js

```js
#! /usr/bin/env node
// cli文件开头必须这样写
// 如果是Linux或macOS系统还需要修改此文件的读写权限为755，具体就是通过 chmod 755 cli.js 实现修改

const fs = require('fs')
const inquirer = require('inquirer')
const path = require('path')
const ejs = require('ejs')
inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'project name',
    required:true
}]).then(answers => {
    if(!answers.name){
        console.log('cancel')
        return
    }
    const tmpDir = path.join(__dirname, 'templates')
    const destDir = process.cwd()
    fs.readdir(tmpDir, (err, files) => {
        if (err) console.log(err)
        files.forEach(file => {
            ejs.renderFile(path.join(tmpDir, file), answers, (err, res) => {
                if (err) console.log(err)
                fs.writeFileSync(path.join(destDir, file), res)
            })
        });
    })
})
```

然后执行，就可以进行本地调试

``` bash
npm link
```
取消本地链接
```bash
# 将当前项目从全局node_modules中删除
npm unlink
# link存在取消当前项目链接
npm unlink your-lib
# link不存在
rm -rf node_modules
npm install -S your-lib
```


问题
* 为什么全局安装`npm install -g @vue/cli`后会添加命令为vue？
* 全局安装@vue/cli发生了什么？
* 执行vue命令发生了什么？为什么vue指向一个js文件，为什么我们可以直接通过vue命令去执行它？

`npm install -g @vue/cli`后，vue的安装目录下package.json下bin决定了vue的命令
```js
{
  "bin": {
    "vue": "bin/vue.js"
  }
}
```
在执行vue命令时就会执行上面`bin/vue.js`文件

js文件无法直接执行，但是在js代码开头加上`#! /usr/bin/env node`就可以直接执行js代码了。其中`/usr/bin/env` 指的就是环境变量，`/usr/bin/env node`就是在环境变量中查找node。其实就相当于执行了`node xx.js`命令


```js
#! /usr/bin/env node
xxx
```
`/usr/bin/env`也可以替换为node的安装路径，但是这样做可能会导致在别人的电脑上无法运行，因为每个人node的安装路径可能会不一样

### 脚手架参数
```js
console.log(process.argv)
```
