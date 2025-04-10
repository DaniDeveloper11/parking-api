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
  
    // const hashedPassword = await bcrypt.hash('123456', 10);
  
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

describe('👨‍💼 Usuario CORPORATE', () => {
  test('✅ Puede hacer check-in en parking privado entre semana', async () => {
    mockDate('2025-04-08T10:00:00'); // Martes

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: privateParking.id });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('❌ No puede hacer check-in en parking privado en fin de semana', async () => {
    mockDate('2025-04-06T10:00:00'); // Domingo

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: privateParking.id });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('success', false);
  });

  test('✅ Puede hacer check-in en parking público', async () => {
    mockDate('2025-04-09T14:00:00'); // Miércoles

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: publicParking.id });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('❌ No puede hacer check-in en parking de cortesía', async () => {
    mockDate('2025-04-09T14:00:00'); // Miércoles

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: courtesyParking.id });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('success', false);
  });
});
