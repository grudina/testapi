import Router from 'koa-router'
import config from '../../config'
import moment from 'moment'
import JWT from 'jsonwebtoken'
import UserRepo from '../../models/user'
import TokenRepo from '../../models/token'

async function login(ctx) {
  const { login, password } = ctx.request.body
  try {
    const dbUser = await UserRepo.checkAuth({ login, password })
    const date = new Date().toISOString()
    const user = {
      ...dbUser,
      password: undefined
    }
    const rawToken = {
      id: dbUser.id,
      email: dbUser.email,
      login: dbUser.login,
      phoneNumber: dbUser.phoneNumber
    }
    const token = JWT.sign(rawToken, config.jwt.private || config.jwt.secret, config.jwt.opts)
    TokenRepo.create({
      tokens: token,
      user_id: dbUser.id,
      expiredAt: moment(date).utc().add(10, 'm').format(),
      createdAt: date,
      modifiedAt: date
    }).save()
    ctx.response.status = 200
    ctx.response.body = {
      success: true,
      data: user,
      token: `Bearer ${token}`
    }
  } catch(err) {
    console.log(err)
    ctx.response.status = 404
    ctx.response.body = {
      code: 404,
      success: false,
      msg: err
    }
  }
}


export default function configureRouter(): Array<Function> {
  const router = Router()
  router.post('/signin', login)

  return [router.routes(), router.allowedMethods()]
}