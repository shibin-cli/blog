const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const session = require('koa-session')
const static = require('koa-static')
const CSRF = require('koa-csrf')

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
app.use(new CSRF({
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
    disableQuery: false
  }))
app.use(cors({
    credentials: true
}))
router.get('/csrf',async (ctx)=>{
    ctx.body={
        csrf: ctx.csrf
    }
})
router.get('/user', async (ctx) => {

    console.log(ctx.session.user)
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