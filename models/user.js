import { manager } from './index'
import bcrypt from 'bcrypt'

const HASH_START = '$2a$'

export default {
  ...manager.getRepository('users'),
  async checkAuth({ login, password }) {
    const query = manager.startQuery().select()
      .field('user.*')
      .from('users', 'user')
      .where('user.login = ?', login)
    const [user] = await query.execute()
    if (!user) {
      throw {
        msg: 'User not found',
      }
    }
    const hash = HASH_START + user.password.substring(4)
    if (await bcrypt.compare(password, hash)) {
      this.hydrate(user, true)
      return {...user}
    } else {
      throw {
        msg: 'Invalid Password',
        user
      }
    }
  },
  async validateLogin(value) {
    const result = await manager.startQuery().select()
      .field('login')
      .from('users')
      .where('login = ?', value)
      .execute()
    return result
  }
}