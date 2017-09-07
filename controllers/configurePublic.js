/** @flow */
import Router from 'koa-router'
import configureLogin from './user/login'

export default function configureRouter(): Array<Function> {
  const router = Router()
  router.use(...configureLogin())
  
  return [router.routes(), router.allowedMethods()]
}