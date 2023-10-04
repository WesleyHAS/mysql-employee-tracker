const inquirer = require("inquirer");
const mysql = require("mysql2");
const sequelize = require("./config/connection");

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.actions) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          sequelize.close();
          console.log("Goodbye!");
          process.exit();
      }
    });
}

//Function to view roles
function viewRoles() {
  sequelize
    .query("SELECT * FROM role", { type: sequelize.QueryTypes.SELECT })
    .then((roles) => {
      console.log("\nList of Roles:");
      console.table(roles);
      init();
    })
    .catch((err) => {
      console.error("Error fetching roles: ", err);
      init();
    });
}

//Function to view employees
function viewEmployees() {
  sequelize
    .query("SELECT * FROM employee", { type: sequelize.QueryTypes.SELECT })
    .then((employees) => {
      console.log("\nList of Employees:");
      console.table(employees);
      init();
    })
    .catch((err) => {
      console.error("Error fetching employees: ", err);
      init();
    });
}

//Function to view departments
function viewDepartments() {
  sequelize
    .query("SELECT * FROM department", { type: sequelize.QueryTypes.SELECT })
    .then((departments) => {
      console.log("\nList of Departments:");
      console.table(departments);
      init();
    })
    .catch((err) => {
      console.error("Error fetching departments: ", err);
      init();
    });
}

init();
