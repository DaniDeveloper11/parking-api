const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

beforeAll(async () => {
  await db.sequelize.sync({ force: true }); // clean db before all of request
});

afterAll(async () => {
  await db.sequelize.close(); // close database
});

describe('🧪 USERS API', () => {
  describe('GET /api/users', () => {
    it('should respond with status 200 and return an array', async () => {
      const response = await request(app).get('/api/users');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user and return 201', async () => {
      const userData = {
        name: 'Daniel',
        email: 'daniel@example.com',
        password: 'securepassword',
        userType: 'admin'
      };

      const response = await request(app).post('/api/users').send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'User was created');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    it('should fail if email already exists', async () => {
      const response = await request(app).post('/api/users').send({
        name: 'Duplicado',
        email: 'daniel@example.com', 
        password: 'otraClave',
        userType: 'user'
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('error', 'Email is already exist');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/users').send({
        name: 'Incompleto'
        // missed email y password
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required fields');
    });
  });
});
