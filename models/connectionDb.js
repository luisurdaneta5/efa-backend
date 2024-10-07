const { Sequelize } = require("sequelize");
require("dotenv").config();

const config = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorAliases: false,
};

const sequelize = new Sequelize(config);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
