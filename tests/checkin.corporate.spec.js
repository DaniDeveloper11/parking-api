const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');
const bcrypt = require('bcryptjs');

let token;
let privateParking, publicParking, courtesyParking;

const mockDate = (dateStr) => {
    jest.useFakeTimers().setSystemTime(new Date(dateStr));
  };

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    corporateUser = await db.User.create({
      name: 'Corporate Test',
      email: 'corporate@test.com',
      password: '123456',
      userType: 'corporate',
    });
  
    //user was authenticated
    const loginRes = await request(app)
    .post('/api/users/login')
    .send({
      email: 'corporate@test.com',
      password: '123456',
    });
  
  token = loginRes.body.token;


  
    privateParking = await db.Parking.create({ name: 'Privado', parkingType: 'private' });
    publicParking = await db.Parking.create({ name: 'Público', parkingType: 'public' });
    courtesyParking = await db.Parking.create({ name: 'Cortesía', parkingType: 'courtesy' });
  });

  afterAll(async () => {
    await db.sequelize.close();
    jest.useRealTimers(); // restaurar fecha real
  });

describe('CORPORATE User', () => {
  test('✅ Can check-in in private parking just on weekdays', async () => {
    mockDate('2025-04-08T10:00:00'); // tuesday

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: privateParking.id });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('❌ Cannot check-in en private parkingen on weekdays', async () => {
    mockDate('2025-04-06T10:00:00'); // sunday

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: privateParking.id });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('success', false);
  });

  test('✅Cam check-in in public parking', async () => {
    mockDate('2025-04-09T14:00:00'); // Miércoles

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: publicParking.id });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('❌ Cannot check-in in courtesy parking ', async () => {
    mockDate('2025-04-09T14:00:00'); // Miércoles

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: courtesyParking.id });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('success', false);
  });
});
