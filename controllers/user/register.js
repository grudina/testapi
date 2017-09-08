import Router from 'koa-router'
import config from '../../config'
import moment from 'moment'
import JWT from 'jsonwebtoken'
import UserRepo from '../../models/user'
import TokenRepo from '../../models/token'
import RegisterFilter from '../filters/registerFilter'

async function register(ctx) {
  try {
    const { body } = ctx.request
    const date = new Date().toISOString()
    const user = await RegisterFilter.setData(body).isValid()
    const savedUser = UserRepo.create({
      ...user,
      createdAt: date,
      modifiedAt: date
    }).save()
    if (!savedUser) {
      throw new Error('user didn\'t save')
    }
    const rawToken = {
      id: savedUser.id,
      email: savedUser.email,
      login: savedUser.login,
      phoneNumber: savedUser.phoneNumber
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
      user: savedUser,
      success: true,
      token: `Bearer ${token}`
    }
  } catch(err) {
    console.log(err)
    ctx.response.status = 500
    ctx.response.body = {
      code: 500,
      success: false,
      msg: err
    }
  }
}

export default function configureRouter(): Array<Function> {
  const router = Router()
  router.post('/signup', register)

  return [router.routes(), router.allowedMethods()]
}