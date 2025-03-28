const { Sequelize } = require('sequelize');

require('dotenv').config();
const DB = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;


const sequelize = new Sequelize(DB, username, password, {
    host: host,
    dialect: "mysql"
  });

  module.exports = sequelize