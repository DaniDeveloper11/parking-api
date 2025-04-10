const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

let token;
let privateParking, publicParking, courtesyParking;
// let visitorUser;

const mockDate = (dateStr) => {
  jest.useFakeTimers().setSystemTime(new Date(dateStr));
};

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  visitorUser = await db.User.create({
    name: 'Visitor Test',
    email: 'visitor@test.com',
    password: '123456',
    userType: 'visitor',
  });

  const loginRes = await request(app)
    .post('/api/users/login')
    .send({ email: 'visitor@test.com', password: '123456' });

  token = loginRes.body.token;

  privateParking = await db.Parking.create({ name: 'Privado', parkingType: 'private' });
  publicParking = await db.Parking.create({ name: 'Público', parkingType: 'public' });
  courtesyParking = await db.Parking.create({ name: 'Cortesía', parkingType: 'courtesy' });
});

afterAll(async () => {
  await db.sequelize.close();
  jest.useRealTimers();
});

describe('👨‍👩‍👧‍👦 Usuario VISITOR', () => {
  test('✅ Puede hacer check-in en cortesía solo fin de semana', async () => {
    mockDate('2025-04-06T10:00:00'); // Domingo

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: courtesyParking.id });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('❌ No puede hacer check-in en cortesía entre semana', async () => {
    mockDate('2025-04-09T10:00:00'); // Miércoles

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: courtesyParking.id });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('success', false);
  });

  test('✅ Puede hacer check-in en público', async () => {
    mockDate('2025-04-09T12:00:00'); // Miércoles

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: publicParking.id });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('❌ No puede hacer check-in en privado', async () => {
    mockDate('2025-04-09T12:00:00'); // Miércoles

    const res = await request(app)
      .post('/api/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ parkingId: privateParking.id });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('success', false);
  });
});
