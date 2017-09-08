import { InputFilter, StringLength, Callback } from 'input-filter'
import UserRepo from '../../models/user'

const passwordReg = /(?=^.{8,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
const emailReg = /^(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[A-Za-z0-9-]*[A-Za-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/

export default InputFilter.factory({
  email: { // added
    required: true,
    filters: ['StringTrim'],
    validators: [
      isString,
      new Callback(value => {
        if (emailReg.test(value)) {
          return UserRepo.validateEmail(value).then(result => {
            if (result.length === 0) {
              return InvitationsRepo.emailCheck(value).then(result => {
                if (result.length === 0) {
                  return Promise.resolve(value)
                } else {
                  return Promise.reject('Invalid email. Please try again.')
                }
              })
            } else {
              return Promise.reject('Invalid email. Please try again.')
            }
          })
        } else {
          return Promise.reject('Invalid email. Please try again.')
        }
      })

    ]
  },
  login: { // added
    required: true,
    filters: ['StringTrim'],
    validators: [
      isString,
      new StringLength({ min: 3 }),
      new Callback((value, context) => {
        if (value === context.email && emailReg.test(value)) {
          return Promise.reject('Username cannot be email')
        }
        return UserRepo.validateLogin(value).then(result => {
          if (value.match(/\W/)) {
            return Promise.reject('Wrong login')
          } else if (result.length === 0) {
            return Promise.resolve(value)
          } else {
            return Promise.reject('Invalid login. Please try again.')
          }
        })
      })
    ]
  },
  password: { // added
    required: true,
    validators: [
      isString,
      new StringLength({ min: 6 }),
      new Callback(value => {
        if (passwordReg.test(value)) {
          return true
        } else {
          return Promise.reject('Wrong password')
        }
      })
    ]
  },
  phoneNumber: { // added
    required: true,
    validators: [
      isString,
      new StringLength({ min: 13 }),
      new Callback(value => {
        if (value.match(/_/)) {
          return Promise.reject('Wrong phone')
        } else {
          return true
        }
      })
    ]
  }
})