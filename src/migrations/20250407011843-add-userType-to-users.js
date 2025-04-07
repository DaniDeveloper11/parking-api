'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'userType',{
      type: Sequelize.STRING,
      allowNull:false,
      defaultValue:'visitor',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('Users','userType')
  }
};
