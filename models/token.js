import { manager } from './index'

export default {
  ...manager.getRepository('tokens')
}