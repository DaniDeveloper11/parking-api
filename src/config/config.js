
require('dotenv').config();
module.exports = {
    development: {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '199811',
      database: process.env.DB_NAME || 'parking_db',
      host: process.env.DB_HOST || 'postgres',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    },
    test: {
      username: 'postgres',
      password: process.env.DB_PASSWORD || '199811',
      database: 'parking_test_db',
      host: process.env.DB_HOST || 'postgres', 
      dialect: 'postgres',
      logging: false,
    }
  };
  