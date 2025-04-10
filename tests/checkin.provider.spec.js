const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

let token;
let privateParking, publicParking, courtesyParking;
// let providerUser;

// const mockDate = (dateStr) => {
//     jest.useFakeTimers().setSystemTime(new Date(dateStr));
//   };


  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  
    providerUser = await db.User.create({
      name: 'Provider Test',
      email: 'provider@test.com',
      password: '123456', 
      userType: 'provider',
    });
  
    // Login
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'provider@test.com', password: '123456' });
  
    token = loginRes.body.token;
  
    // Create parkings
    privateParking = await db.Parking.create({ name: 'Privado', parkingType: 'private' });
    publicParking = await db.Parking.create({ name: 'Público', parkingType: 'public' });
    courtesyParking = await db.Parking.create({ name: 'Cortesía', parkingType: 'courtesy' });
  });

afterAll(async () => {
  await db.sequelize.close();
});

describe('PROVIDER User', () => {
    test('✅ can check-in in public parking', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: publicParking.id });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  
    test('❌ cannot check-in in private parking', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: privateParking.id });
  
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
    });
  
    test('❌ cannot check-in in courtesy', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: courtesyParking.id });
  
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
    });
  });