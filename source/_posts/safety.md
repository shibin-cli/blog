---
title: Web安全
tag: 安全
date: 2021-08-22
categories: 
- 前端
- 安全
---
## 跨站脚本攻击XSS（Cross-site scripting）
通过在目标网站注入恶意脚本，利用这些恶意脚本，获取用户的敏感信息Cookie、Session等

XSS带来的危害
* 获取用户Cookie、Session、Storage
* 按键钓鱼
* 劫持前端逻辑
* 发送请求
* ...
### DOM XSS
``` html
<div id="app">
    <p v-html="text"></p>
</div>
```
``` js
Vue.createApp({
    data() {
        return {
            text: '<h1>哈哈哈哈哈啊哈哈</h1>',
            script:`<img src="xxx" onerror="alert('我拿到你的信息了(Cookie、Session、Storage)，正在给我转一个亿')">`
        }
    }
}).mount('#app')
```
### 反射型XSS
构造恶意的url，例如`http://xxx.com?a=<script>xxxx</script>`等
### 存储型XSS
恶意代码提交到数据库中如js代码片段
``` js
// 后端返回数据、
{
    "data": [{
        content: '<h1>文章1</h1><img src="xxx" onerror="xxxxxxx">'
    }]
}
// 当把后端返回的数据显示在页面中是，就会执行恶意代码
```
### XSS注入点
* html内嵌文本，以script标签注入
* 内联javascript中，拼接数据突破原本的规则
* href、src等属性中
* onload、onerror、onclick中
* ...

### 防御手段
* 在输出的时候进行处理转义等
* 纯前端渲染
  * 明确要设置的内容是文本、属性、样式等
  * 图片等属性和事件给处理掉
* 尽量少使用innerHTML等
* [内容安全策略CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)（需要注意浏览器兼容性）、[X-XSS-Protection](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection)（早期的Chrome、Safari ）等

一般可以使用第三方库进行处理如[js-xss](https://github.com/leizongmin/js-xss)等

## 跨站请求伪造（CSRF或XSRF）
### 流程
* 用户登录A网站
* 攻击者引诱用户进入B网站，并向A网站发送了一个请求
* A网站收到请求（以为是用户A发送的请求），执行了xxx的操作
* 攻击完成，在用户不知情的情况下执行了攻击者的操作

### CSRF案例
安装依赖
``` bash
npm i koa @koa-router koa-bodyparser koa-session koa-static @koa/cors
```
后端代码
``` js
const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const session = require('koa-session')
const static = require('koa-static')

const app = new Koa()
const router = new Router()

app.keys = ['some secret hurr']
const CONFIG = {
    key: 'koa.sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    secure: false,
    sameSite: null,
}
app.use(static('.'));
app.use(session(CONFIG, app))
app.use(bodyParser())
app.use(cors({
    credentials: true
}))

router.get('/user', async (ctx) => {
    if (ctx.session.user) {
        ctx.body = ctx.session.user
        return
    }
    ctx.body = {
        code: 1
    }

})
router.post('/pay', async (ctx) => {
    const {
        count
    } = ctx.request.body
    const user = ctx.session.user
    if (user && count) {
        ctx.body = {
            code: 0,
            msg: `用户${user.username}支付${count}元成功`
        }
    }
})
router.post('/login', async (ctx) => {
    const user = ctx.request.body
    if (user.username === 'shibin' && user.password === '123456') {
        ctx.session.user = {
            username: 'shibin',
            id: 'sdsadsasd12132'
        }
        ctx.body = {
            code: 0
        }
    } else {
        ctx.body = {
            code: 1
        }
    }
})
app.use(router.allowedMethods())
    .use(router.routes())

app.listen(3000, () => {
    console.log('serve listen http://localhost:3000')
})
```
随便开启个服务，A网站访问，登录用户名`shibin`密码`123456`
``` js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div>
        <div>用户名：<input id="username"></div>
        <div>密码：<input id="password" type="password"></div>
        <button id="button">登录</button>
    </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js"></script>
<script>
    document.getElementById('button').addEventListener('click', () => {
        axios.post('http://localhost:3000/login', {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }).then(res => {
            if (res.data.code !== 0) {
                alert('用户名或密码错误')
            } else {
                alert('登录成功')
            }

        }).catch(e => {
            console.log(e)
        })
    })
</script>
```
在开启另一个服务，访问B网站（可以看做是从别的地方进入一个钓鱼网站）
``` html
<!-- B网站，也可以是个隐藏的表单提交，就算后端限制跨域也可以提交 -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>CSRF攻击</h1>
    <h1>领取现金了</h1>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js"></script>
<script>
    const request = axios.create({
        withCredentials: true
    })
    request.post('http://localhost:3000/pay', {
        count: 100000000
    }).then(res => {
        alert(res.data.msg)
    })
</script>
</html>
```
访问B网站，会在用户不知情的情况下做一些有害的操作如转账等
### 防护策略
* Origin Header
* Referer Header
* CSRF Token

设置请求源
``` js
app.use(cors({
    credentials: true,
    origin: [xxx]
}))
```
还可以使用一些库如后端渲染[koa-csrf](https://github.com/koajs/csrf)
## 点击劫持（伪装网站）
攻击者伪造一个网站，将另一个网站引入进来隐藏在页面上(iframe透明)，当操作攻击者的网站时，就会操作正常的网站上的内容。如银行网站等
### 案例
攻击者的网站
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        iframe{
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
        }
    </style>
</head>
<body>
    <div>
        <button>点击给你100万</button>
    </div>
    <iframe src="http://localhost:3000/b.html"></iframe>
</body>
</html>
```
某银行网站
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <button id="btn">点击给别人转100万</button>
    </div>
</body>
<script>
    document.getElementById('btn').addEventListener('click',()=>{
        // xxx
        alert('转账成功')
    })
</script>
</html>
```
当用户操作攻击者的网站时，就相当于是在银行网站上操作
### 防护策略
#### 阻止顶级导航
通过`window.top`判断当前窗口的最顶层浏览器窗口对象
``` js
// 在一些较新的浏览器中会阻止跳转
if (top.location !== window.location) {
  top.location = window.location
}
```
但这种方式容易被破解如
``` js
window.onbeforeunload = function() {
  return false;
}
```
sandbox，沙箱化的`iframe`不能更改`top.location`
``` js
<iframe sandbox="allow-scripts allow-forms" src="facebook.html"></iframe>
```
#### X-FRAME-OPTIONS
设置http相应头信息总的X-FRAME-OPTIONS，可以指示浏览器是否应该加载改iframe页面
X-Frame-Options的三种形式
* `DENY`，不能被任何iframe或frame嵌套
* `SAMEORIGIN`，只能在本站嵌套
* `ALLOW-FROM url`，指定可以嵌套的来源

nginx配置
``` conf
add_header X-Frame-Options SAMEORIGIN;
```

## HTTP安全传输
http的缺点
* 明文传说
* 不验证通信方的身份，可能会遭遇伪装
* 无法证明报文的完整性，可能会被篡改

解决方式
* 使用https传输
## 第三方依赖安全问题
* 第三方依赖，尽量使用成熟的第三方依赖包
* 使用`npm audit`检测依赖包的风险
* Sonarqube代码审查工具，在线的扫描服务
* snyk本地扫描
