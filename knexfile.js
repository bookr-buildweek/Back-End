require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_DEV,
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'bookr_dev'
    },
    seeds: { directory: './database/seeds' }
  },
  testing: {
    client: 'pg',
    connection: process.env.PG_TEST,
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'bookr_test'
    },
    "pool": {
      "min" : 1,
      "max": 7
    },
    seeds: { directory: './database/seeds' }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'bookr'
    },
    seeds: { directory: './database/seeds' }
  }
};
