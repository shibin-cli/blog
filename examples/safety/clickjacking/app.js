const Koa = require('koa')
const Router = require('@koa/router')
const static = require('koa-static')

const app = new Koa()
const router = new Router()

app.use(static('.'))

app.use(router.allowedMethods())
    .use(router.routes())

app.listen(3000, () => {
    console.log('serve listen http://localhost:3000')
})