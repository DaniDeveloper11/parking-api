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

    return queryInterface.bulkInsert('Parkings',[
      {
        name: 'Estacionamiento Centro',
        normalizedName: 'estacionamiento_centro',
        spots: 120,
        contacto: '3312345678',
        parkingType: 'public',
        userId: userMap['daniel@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Estacionamiento VIP',
        normalizedName: 'estacionamiento_vip',
        spots: 500,
        contacto: '3311111111',
        parkingType: 'private',
        userId: userMap['ana@correo.com'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Parkings',null,{});
  }
};
