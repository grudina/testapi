/** @flow */
import {createManager} from 'minorm'
import Winston from 'winston'
import config from '../config'

export const manager = createManager(config.db, Winston)

manager.connect()