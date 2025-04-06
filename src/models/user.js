'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcryptjs'); 

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here si ocupas
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type:DataTypes.STRING,
        unique:true
      },
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      timestamps:true,
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Parking,{
      foreignKey:'userId',
      as:'parking'
    })
  }

  return User;
};
