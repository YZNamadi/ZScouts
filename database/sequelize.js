require('dotenv').config(); 
const { Sequelize } = require('sequelize');

// Retrieve database connection details from the environment
const DB_NAME = process.env.DATABASE_NAME;
const DB_USER = process.env.DATABASE_USERNAME;
const DB_PASS = process.env.DATABASE_PASSWORD;
const DB_HOST = process.env.DATABASE_HOST;
const DB_PORT = process.env.DATABASE_PORT;


// Create a new Sequelize instance using the environment variables
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT), 
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
