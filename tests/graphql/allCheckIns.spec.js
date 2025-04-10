const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

let token;
let user;
let parking;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  // Crear usuario
  user = await db.User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: '123456',
    userType: 'corporate',
  });

  // Login para obtener token
  const res = await request(app)
    .post('/api/users/login')
    .send({ email: 'admin@test.com', password: '123456' });

  token = res.body.token;

  // Crear parking
  parking = await db.Parking.create({
    name: 'Parking 1',
    parkingType: 'public',
  });

  // Crear check-in
  await db.CheckIn.create({
    userId: user.id,
    parkingId: parking.id,
    userType: user.userType,
    success: true
  });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('🔍 GraphQL - allCheckIns', () => {

    test('✅ CheckIn in database has to have realation with user', async () => {
        const checkIns = await db.CheckIn.findAll({ include: db.User });
        expect(checkIns[0].User).toBeTruthy();
      });


  test('✅ has to return all of check-ins with users and parkings', async () => {
    const query = `
      query {
        allCheckIns {
          totalItems
          data {
            id
            user {
              name
              email
              userType
            }
            parking {
              name
            }
          }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.allCheckIns.totalItems).toBeGreaterThan(0);
    expect(res.body.data.allCheckIns.data[0]).toHaveProperty('user');
    expect(res.body.data.allCheckIns.data[0]).toHaveProperty('parking');
    expect(res.body.data.allCheckIns.data[0].user.email).toBe('admin@test.com');
  });
});
