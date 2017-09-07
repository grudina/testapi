import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import JWT from 'koa-jwt'
import Router from 'koa-router'
import config from './config'
import configurePublic from './controllers/configurePublic'

process.env.TZ = 'UTC'

const
  app = new Koa,
  publicRouter = Router(),
  userRouter = Router()
console.log(`Port: ${config.port}`)
app.use(BodyParser())

config.debug && app.use((ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', ctx.get('Origin'))
  ctx.response.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
  ctx.response.set('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  if (ctx.method == 'OPTIONS') {
    ctx.response.status = 204
  } else {
    return next()
  }
})

publicRouter.use('/api', ...configurePublic())
app.use(publicRouter.routes())
// userRouter.use(JWT(config.jwt))
// userRouter.use('/api')
// app.use(userRouter.routes())
app.use(ctx => {
  ctx.response.status = 404
  ctx.response.body = {
    status: false,
    code: 404,
    msg: 'Not found'
  }
})

app.listen(config.port)