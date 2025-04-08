'use strict';

const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize('parking_db', 'postgres', '199811', {
  host: 'postgres',
  dialect: 'postgres',
  logging: false,
});

const db = {};

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
