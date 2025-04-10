'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  

    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users";`
    );

    const userMap = {};
    users[0].forEach(u => {
      userMap[u.email] = u.id;
    });

    await queryInterface.bulkInsert('Parkings', [
      {
        name: 'Estacionamiento Público 1',
        normalizedName: 'estacionamiento_publico_1',
        spots: 50,
        contacto: '+523312345678',
        parkingType: 'public',
        userId: userMap['daniel@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Estacionamiento Público 2',
        normalizedName: 'estacionamiento_publico_2',
        spots: 40,
        contacto: '+523312345679',
        parkingType: 'public',
        userId: userMap['daniel@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Estacionamiento Privado 1',
        normalizedName: 'estacionamiento_privado_1',
        spots: 60,
        contacto: '+523312345680',
        parkingType: 'private',
        userId: userMap['ana@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Estacionamiento Privado 2',
        normalizedName: 'estacionamiento_privado_2',
        spots: 45,
        contacto: '+523312345681',
        parkingType: 'private',
        userId: userMap['ana@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Estacionamiento Cortesía 1',
        normalizedName: 'estacionamiento_cortesia_1',
        spots: 30,
        contacto: '+523312345682',
        parkingType: 'courtesy',
        userId: userMap['miguel@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Estacionamiento Cortesía 2',
        normalizedName: 'estacionamiento_cortesia_2',
        spots: 25,
        contacto: '+523312345683',
        parkingType: 'courtesy',
        userId: userMap['miguel@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parkings', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
