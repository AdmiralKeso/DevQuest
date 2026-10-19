import 'dotenv/config'

// SQLite database. `npm run migrate` creates the file and pushes every
// migration in db/migrations that hasn't run yet.
const shared = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations',
    loadExtensions: ['.js'],
  },
  pool: {
    // SQLite ignores foreign keys unless they are switched on per connection
    afterCreate: (connection, done) => connection.run('PRAGMA foreign_keys = ON', done),
  },
}

export default {
  development: {
    ...shared,
    connection: { filename: process.env.DB_FILENAME || './db/devquest.sqlite3' },
  },
  production: {
    ...shared,
    connection: { filename: process.env.DB_FILENAME || './db/devquest.sqlite3' },
  },
}
