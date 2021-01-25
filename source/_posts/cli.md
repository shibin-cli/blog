---
title: 脚手架
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
