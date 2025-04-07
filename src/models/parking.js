'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Parking.init({
    name: DataTypes.STRING,
    spots: DataTypes.INTEGER,
    contacto: DataTypes.STRING,
    parkingType: DataTypes.ENUM('publi','private','coutesy'),
    normalizedName:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parking',
    timestamps:true
  });
  Parking.associate = (models) => {
    Parking.belongsTo(models.User,{
      foreignKey:'userId',
      as:'owner'
    });
    Parking.hasMany(models.CheckIn,{foreignKey:'parkingId'});
  }
  return Parking;
};