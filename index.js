// Import required modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const sequelize = require("./config/connection");

// Function to initialize the application
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View Employees By Manager",
          "View Employees By Department",
          "Add Employee",
          "Delete Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "Add Role",
          "Delete Role",
          "View All Departments",
          "View Department Budget",
          "Add Department",
          "Delete Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.actions) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View Employees By Manager":
          viewEmployeesByManagerId();
          break;
        case "View Employees By Department":
          viewEmployeesByDepartment();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "View Department Budget":
          viewDepartmentBudget();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Delete Department":
          deleteDepartment();
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
  const query = `
    SELECT
      r.id AS role_id,
      r.title AS role_title,
      r.salary,
      d.name AS department_name
    FROM role AS r
    LEFT JOIN department AS d ON r.department_id = d.id
  `;

  sequelize
    .query(query, { type: sequelize.QueryTypes.SELECT })
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
  const query = `
    SELECT 
      e.id AS employee_id,
      e.first_name,
      e.last_name,
      r.title AS role,
      r.salary,
      d.name AS department,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee AS e
    LEFT JOIN role AS r ON e.role_id = r.id
    LEFT JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id
  `;

  sequelize
    .query(query, { type: sequelize.QueryTypes.SELECT })
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

// Function to view employee by manager ID
function viewEmployeesByManagerId() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "managerId",
        message: "Enter the Manager ID to view employees managed by them:",
      },
    ])
    .then((response) => {
      const managerId = parseInt(response.managerId);

      const query = `
        SELECT 
          e.id AS employee_id,
          e.first_name,
          e.last_name,
          r.title AS role,
          r.salary,
          d.name AS department
        FROM employee AS e
        INNER JOIN role AS r ON e.role_id = r.id
        INNER JOIN department AS d ON r.department_id = d.id
        WHERE e.manager_id = ?
        ORDER BY e.id
      `;

      sequelize
        .query(query, {
          type: sequelize.QueryTypes.SELECT,
          replacements: [managerId],
        })
        .then((employees) => {
          console.log(`\nEmployees managed by Manager ID ${managerId}:`);
          console.table(employees);
          init();
        })
        .catch((err) => {
          console.error("Error fetching employees by manager ID: ", err);
          init();
        });
    });
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  const departmentQuery = "SELECT name FROM department";

  sequelize
    .query(departmentQuery, { type: sequelize.QueryTypes.SELECT })
    .then((departments) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentName",
            message:
              "Select a Department to view employees in that department:",
            choices: departments.map((department) => department.name),
          },
        ])
        .then((response) => {
          const departmentName = response.departmentName;

          const query = `
            SELECT 
              e.id AS employee_id,
              e.first_name,
              e.last_name,
              r.title AS role,
              r.salary,
              d.name AS department
            FROM employee AS e
            INNER JOIN role AS r ON e.role_id = r.id
            INNER JOIN department AS d ON r.department_id = d.id
            WHERE d.name = ?
            ORDER BY e.id
          `;

          sequelize
            .query(query, {
              type: sequelize.QueryTypes.SELECT,
              replacements: [departmentName],
            })
            .then((employees) => {
              console.log(`\nEmployees in the Department: ${departmentName}`);
              console.table(employees);
              init();
            })
            .catch((err) => {
              console.error("Error fetching employees by department: ", err);
              init();
            });
        });
    })
    .catch((err) => {
      console.error("Error fetching departments: ", err);
      init();
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

// Function to delete employee
function deleteEmployee() {
  const employeeQuery = "SELECT id, first_name, last_name FROM employee";

  sequelize
    .query(employeeQuery, { type: sequelize.QueryTypes.SELECT })
    .then((employees) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select an Employee to delete:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
        ])
        .then((response) => {
          const employeeId = response.employeeId;
          const deleteQuery = "DELETE FROM employee WHERE id = ?";

          sequelize
            .query(deleteQuery, {
              type: sequelize.QueryTypes.DELETE,
              replacements: [employeeId],
            })
            .then(() => {
              console.log("Employee deleted successfully.");
              init();
            })
            .catch((err) => {
              console.error("Error deleting employee: ", err);
              init();
            });
        });
    })
    .catch((err) => {
      console.error("Error fetching employees: ", err);
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

// Function to update employee manager
function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message:
          "Enter the ID of the employee whose manager you want to update:",
      },
      {
        type: "input",
        name: "managerId",
        message: "Enter the ID of the new manager for the employee:",
      },
    ])
    .then((employeeData) => {
      sequelize
        .query("UPDATE employee SET manager_id = ? WHERE id = ?", {
          replacements: [employeeData.managerId, employeeData.employeeId],
        })
        .then(() => {
          console.log("Employee's manager updated successfully!");
          init();
        })
        .catch((err) => {
          console.error("Error updating employee's manager: ", err);
          init();
        });
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

// Function to delete role
function deleteRole() {
  const roleQuery = "SELECT id, title FROM role";

  sequelize
    .query(roleQuery, { type: sequelize.QueryTypes.SELECT })
    .then((roles) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "roleId",
            message: "Select a Role to delete:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((response) => {
          const roleId = response.roleId;
          const deleteQuery = "DELETE FROM role WHERE id = ?";

          sequelize
            .query(deleteQuery, {
              type: sequelize.QueryTypes.DELETE,
              replacements: [roleId],
            })
            .then(() => {
              console.log("Role deleted successfully.");
              init();
            })
            .catch((err) => {
              console.error("Error deleting role: ", err);
              init();
            });
        });
    })
    .catch((err) => {
      console.error("Error fetching roles: ", err);
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

function viewDepartmentBudget() {
  const departmentQuery = "SELECT id, name FROM department";

  sequelize
    .query(departmentQuery, { type: sequelize.QueryTypes.SELECT })
    .then((departments) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Select a Department to view the total budget:",
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((response) => {
          const departmentId = response.departmentId;
          const budgetQuery = `
            SELECT 
              SUM(r.salary) AS total_budget
            FROM employee AS e
            INNER JOIN role AS r ON e.role_id = r.id
            WHERE r.department_id = ?
          `;

          sequelize
            .query(budgetQuery, {
              type: sequelize.QueryTypes.SELECT,
              replacements: [departmentId],
            })
            .then((result) => {
              if (result.length === 0 || result[0].total_budget === null) {
                console.log(
                  `\nNo budget information found for the selected department.\n`
                );
              } else {
                console.log(
                  `\nTotal Utilized Budget for the Department: ${result[0].total_budget}\n`
                );
              }
              init();
            })
            .catch((err) => {
              console.error("Error calculating department budget: ", err);
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

// Function to delete department
function deleteDepartment() {
  const departmentQuery = "SELECT id, name FROM department";

  sequelize
    .query(departmentQuery, { type: sequelize.QueryTypes.SELECT })
    .then((departments) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Select a Department to delete:",
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((response) => {
          const departmentId = response.departmentId;
          const deleteQuery = "DELETE FROM department WHERE id = ?";

          sequelize
            .query(deleteQuery, {
              type: sequelize.QueryTypes.DELETE,
              replacements: [departmentId],
            })
            .then(() => {
              console.log("Department deleted successfully.");
              init();
            })
            .catch((err) => {
              console.error("Error deleting department: ", err);
              init();
            });
        });
    })
    .catch((err) => {
      console.error("Error fetching departments: ", err);
      init();
    });
}

init();
