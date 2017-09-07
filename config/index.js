
export default {
  port: process.env.PORT || 3000,
  debug: true,
  jwt: {
    secret: 'arklign-private',
    public: 'arklign-private',
    opts: {
      // algorithm: 'RS256'
    }
  },
  db: {
    host: 'localhost',
    user: 'root',
    password: '1',
    database: 'test_database'
  }
}
