const inquirer = require("inquirer");
const mysql = require("mysql2");
const sequelize = require("./config/connection");

//create a seed for departments

//make a function to view departments

//try to visualize on console

//function to add another department

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
          sequelize.end();
          console.log("Goodbye!");
          process.exit();
      }
    });
}

init();
