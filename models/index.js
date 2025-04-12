'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelFactory = require(path.join(__dirname, file));
    const model = modelFactory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define associations here (if not defined in each model)
db.Player.hasMany(db.Rating, { foreignKey: 'playerId', as: 'ratings' });
db.Scout.hasMany(db.Rating, { foreignKey: 'scoutId', as: 'ratings' });
db.Rating.belongsTo(db.Player, { foreignKey: 'playerId', as: 'player' });
db.Rating.belongsTo(db.Scout, { foreignKey: 'scoutId', as: 'scout' });
db.Player.hasOne(db.PlayerKyc, { foreignKey: 'playerId', as: 'playerKyc' });
db.PlayerKyc.belongsTo(db.Player, { foreignKey: 'playerId', as: 'player' });
db.Scout.hasOne(db.ScoutKyc, { foreignKey: 'scoutId', as: 'scoutKyc' });
db.ScoutKyc.belongsTo(db.Scout, { foreignKey: 'scoutId', as: 'scout' });



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
