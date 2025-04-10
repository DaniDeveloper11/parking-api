const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');
// const bcrypt = require('bcryptjs');

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    // const hashedPassword = await bcrypt.hash('123456',10)
  
    // user was created
    await db.User.create({
      name: 'Daniel Tester',
      email: 'daniel@test.com',
      password: '123456', 
      userType: 'visitor'
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('AUTH - User Login', () => {
    test(' A success login should return token and user data', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'daniel@test.com',
        password: '123456'
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'daniel@test.com');
    });
  
    test('❌ Incorrect email must be returned 401', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'noexiste@test.com',
        password: '123456'
      });
  
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'invalid email');
    });
  
    test('❌ Iconrrect password must be returned 401', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'daniel@test.com',
        password: 'fake-password'
      });
  
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'invalid password');
    });
  
    test('❌ missed fields must be returned 400', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: ''
        // miss password
      });
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email and password are required');
    });
  });