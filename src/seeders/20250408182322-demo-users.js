'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await bcrypt.hash('123456',10);

    return queryInterface.bulkInsert('Users',[
      {
        name:'Daniel',
        email:'daniel@correo.com',
        password:password,
        userType:'corporate',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'Ana',
        email:'ana@correo.com',
        password:password,
        userType:'visitor',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users',null,{});
  }
};
