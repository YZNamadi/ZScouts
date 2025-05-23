require('dotenv').config();
const DB = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const dialect = process.env.DATABASE_DIALECT;

module.exports =
{
    development: {
        "username": username,
        "password": password,
        "database": DB,
        "host": host,
        "dialect": "mysql"
    },
    test: {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    production: {
        "username": username,
        "password": password,
        "database": DB,
        "host": host,
        "dialect": dialect
    }
}
