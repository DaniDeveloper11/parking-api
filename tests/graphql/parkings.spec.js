const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  await db.Parking.bulkCreate([
    { name: 'Zona A', type: 'public', parkingType: 'public', contacto: '123', spots: 10 },
    { name: 'Zona B', type: 'private', parkingType: 'private', contacto: '456', spots: 5 },
    { name: 'Zona C', type: 'courtesy', parkingType: 'courtesy', contacto: '789', spots: 8 },
  ]);
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('🅿️ GraphQL - parkings query', () => {
  test('✅ has to get a list of parkings with totalItems', async () => {
    const query = `
      query {
        parkings {
          totalItems
          data {
            id
            name
            parkingType
          }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.parkings.totalItems).toBe(3);
    expect(res.body.data.parkings.data.length).toBeGreaterThan(0);
    expect(res.body.data.parkings.data[0]).toHaveProperty('name');
  });

  test('✅ can limit the quantity of results', async () => {
    const query = `
      query {
        parkings(limit: 2) {
          totalItems
          data {
            name
          }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.parkings.data.length).toBe(2);
  });

  test('✅ can sort results upward', async () => {
    const query = `
      query {
        parkings(order: "name:ASC") {
          data {
            name
          }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query });

    const names = res.body.data.parkings.data.map(p => p.name);
    expect(names).toEqual([...names].sort()); 
  });
});
