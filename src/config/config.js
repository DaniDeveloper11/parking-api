module.exports = {
    development: {
      username: 'postgres',
      password: '199811',
      database: 'parking_db',
      host: 'localhost', 
      dialect: 'postgres',
      logging: false,
    },
    test: {
      username: 'postgres',
      password: '199811',
      database: 'parking_test_db',
      host: '127.0.0.1', 
      dialect: 'postgres',
      logging: false,
    }
  };
  