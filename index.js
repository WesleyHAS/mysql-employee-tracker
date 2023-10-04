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

// Fetch the list of roles from the database
function getRoles() {
  return sequelize.query("SELECT id, title FROM role", {
    type: sequelize.QueryTypes.SELECT,
  });
}

// Function to add employee
function addEmployee() {
  getRoles()
    .then((roles) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name:",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name:",
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the employee's role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            type: "input",
            name: "managerId",
            message: "Enter the employee's manager ID (if applicable):",
          },
        ])
        .then((employeeData) => {
          sequelize
            .query(
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
              {
                replacements: [
                  employeeData.firstName,
                  employeeData.lastName,
                  employeeData.roleId,
                  employeeData.managerId || null,
                ],
              }
            )
            .then(() => {
              console.log("Employee added successfully!");
              init();
            })
            .catch((err) => {
              console.error("Error adding employee: ", err);
              init();
            });
        });
    })
    .catch((err) => {
      console.error("Error fetching roles: ", err);
      init();
    });
}

// Function to update employee role
function updateEmployee() {
  getRoles()
    .then((roles) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeId",
            message:
              "Enter the ID of the employee whose role you want to update:",
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the updated role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((employeeData) => {
          sequelize
            .query("UPDATE employee SET role_id = ? WHERE id = ?", {
              replacements: [employeeData.roleId, employeeData.employeeId],
            })
            .then(() => {
              console.log("Employee role updated successfully!");
              init();
            })
            .catch((err) => {
              console.error("Error updating employee role: ", err);
              init();
            });
        });
    })
    .catch((err) => {
      console.error("Error fetching roles: ", err);
      init();
    });
}

// Fetch the list of departments from the database
function getDepartments() {
  return sequelize.query("SELECT id, name FROM department", {
    type: sequelize.QueryTypes.SELECT,
  });
}

// Function to add role
function addRole() {
  getDepartments()
    .then((departments) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "Enter the title of the new role:",
          },
          {
            type: "input",
            name: "salary",
            message: "Enter the salary for the new role:",
          },
          {
            type: "list",
            name: "departmentId",
            message: "Select the department for the new role:",
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((roleData) => {
          sequelize
            .query(
              "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
              {
                replacements: [
                  roleData.title,
                  roleData.salary,
                  roleData.departmentId,
                ],
              }
            )
            .then(() => {
              console.log("Role added successfully!");
              init();
            })
            .catch((err) => {
              console.error("Error adding role: ", err);
              init();
            });
        });
    })
    .catch((err) => {
      console.error("Error fetching departments: ", err);
      init();
    });
}

// Function to add new department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the new department:",
      },
    ])
    .then((departmentData) => {
      sequelize
        .query("INSERT INTO department (name) VALUES (?)", {
          replacements: [departmentData.name],
        })
        .then(() => {
          console.log("Department added successfully!");
          init();
        })
        .catch((err) => {
          console.error("Error adding department: ", err);
          init();
        });
    });
}

init();
