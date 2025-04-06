'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Parkings','normalizedName',{
      type: Sequelize.STRING,
      allowNull:false,
      unique:true,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('Parkings','normalizedName');
  }
};
