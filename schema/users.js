import {createSchemaTool} from 'minorm'
import { manager } from '../models/index'

const schemaTool = createSchemaTool(manager)
schemaTool.setSchemaInit({//It's also migration 
 up(schema) {
   schema.table('users', table => {
     table.id()
     table.column('login').notNull()
     table.column('password').notNull()
     table.column('phoneNumber').notNull()
     table.column('email').notNull()
     table.createdAndModified()
   })
   schema.table('tokens', table => {
     table.id()
     table.column('tokens').notNull()
     table.column('expiredAt').text()
     table.column('user_id').int().unsigned()
     table.createdAndModified()
     table.ref('user_id', 'users', 'id')
   })
 },
 down(schema) {
   schema.dropTable('tokens')
   schema.dropTable('users')
 }
})
schemaTool.getMigrationManager().addMigration(
 '2016-11-16 19:01:18',
 {
   up(schema) {
    //  schema.use('tokens', table => {
    //    table.index('tokens')
    //  })
   },
   down(schema) {
    //  schema.use('users', table => {
    //    table.dropIndex('IDX_title')
    //  })
   }
 } 
)
schemaTool.initSchema().then(() => {
 console.log('Database inited')
})