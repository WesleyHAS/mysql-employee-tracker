// Setup connection with the database
const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false,
  },
  console.log(`Connected to the employees_db database.`)
);

module.exports = sequelize;
