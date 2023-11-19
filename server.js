const express = require("express");
const connection = require("./config/connect");
// const validate = require('./validate/validate');
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error("error connecting: ");
    return;
  }
  questions();
});

const questions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add An Employee",
          "Update Employee",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add A Department",
          "Quit",
        ],
      },
    ])
    .then((res) => {
      const choice = res.start;
      switch (choice) {
        case "View All Employees":
          connection.query("SELECT * FROM employee_all", (err, results) => {
            printTable(results);
            questions();
          });
          break;

        case "Add An Employee":
          addEmployee();
          break;

        case "Update Employee":
          updateEmployee().then(questions);
          break;

        case "View All Roles":
          connection.query("SELECT * FROM roles", (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log("\n");
              printTable(results);
              questions();
            }
          });

          break;

        case "Add Role":
          addRole().then(questions);
          break;

        case "View All Departments":
          connection.query("SELECT * FROM department", (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log("\n");
              printTable(results);
              questions();
            }
          });
          break;

        case "Add A Department":
          addDept().then(questions);
          break;

        case "Quit":
          quit();
          console.log("Goodbye!");
          break;

        default:
          console.log("Invalid choice");
          questions();
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const addEmployee = () => {
  new Promise((resolve, reject) => {
    connection.query("SELECT * FROM roles", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(Array.from(results));
      }
    });
  })
    .then((roles) => {
      return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM manager", (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve({ roles, managers: Array.from(results) });
          }
        });
      });
    })
    .then(({ roles, managers }) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "roleChoice",
            message: "What is the employee's role?",
            choices: roles.map((role) => role.job),
          },
          {
            type: "list",
            name: "managerChoice",
            message: "Who is the employee's manager?",
            choices: managers.map((manager) => manager.leader),
          },
        ])
        .then((employeeData) => {
          const role = roles.find((role) => role.job === employeeData.roleChoice);
          console.log(role);
          const manager = managers.find(
            (manager) => manager.leader === employeeData.managerChoice
          );
          console.log(manager);

          const sql =
            "INSERT INTO employee_names (first_name, last_name, roles, manager) VALUES (?, ?, ?, ?)";
          connection.query(sql, [
            employeeData.firstName,
            employeeData.lastName,
            role.role_id,
            manager.man_id,
          ]);

          console.log("Employee added!");
          questions();
        });
    })
    .catch((err) => {
      console.error(err);
    });
};


// add role

const addRole = () => {
  let departments;

  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM department", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  })
    .then((results) => {
      departments = results;
      const deptCurrent = departments.map((department) => department.dept);
      const keysDept = departments.map((department) => department.dept_id);

      return inquirer.prompt([
        {
          type: "input",
          name: "addRole",
          message: "What would you like to call the new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the role's salary?",
        },
        {
          type: "list",
          name: "deptChoice",
          message: "What is the role's department?",
          choices: deptCurrent,
        },
      ]);
    })
    .then((answers) => {
      const deptIndex = departments.findIndex(
        (department) => department.dept === answers.deptChoice
      );
      const departmentId = departments[deptIndex].dept_id;

      const sql = `INSERT INTO roles(job, salary, department) VALUES('${answers.addRole}', ${answers.salary}, ${departmentId})`;
      return connection.promise().query(sql);
    })
    .then(() => {
      console.log("Role added successfully.");
      // questions();
    })
    .catch((error) => {
      console.error("Error adding role:", error);
    });
};

// add department

const addDept = async () => {
  try {
    const { addDep } = await inquirer.prompt([
      {
        type: "input",
        name: "addDep",
        message: "What would you like to call the new department?",
      },
    ]);

    const sql = `INSERT INTO department(dept) VALUES('${addDep}')`;
    await connection.promise().query(sql);

    console.log("Department added successfully.");
    // questions();
  } catch (error) {
    console.error("Error adding department:", error);
  }
};

// update employee

const updateEmployee = async () => {
  // try {
  //   const query = `
  //     SELECT employee_names.id, CONCAT(employee_names.first_name, ' ', employee_names.last_name) AS employee_names, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
  //     FROM employee_names AS employee_names
  //     LEFT JOIN manager AS manager ON employee_names.manager_id = manager.man_id
  //   `;

  //   const [results] = await connection.promise().query(query);
  //   console.log("results", results);
  //   const empCurrent = results.map((row) => row.employee_name);
  //   const keysEmployee = results.map((row) => row.id);
  //   const managerCurrent = results.map((row) => row.manager_name);
  //   const keysManager = results.map((row) => row.manager_id);

  //   const res = await inquirer.prompt([
  //     {
  //       type: "input",
  //       name: "confirm",
  //       message: "Are you sure you want to update an employee?",
  //       default: "yes",
  //     },
  //     {
  //       type: "list",
  //       name: "empChoice",
  //       message: "Which Employee would you like to update?",
  //       choices: empCurrent,
  //     },
  //     {
  //       type: "list",
  //       name: "managerChoice",
  //       message: "Who is the employee's manager?",
  //       choices: managerCurrent,
  //     },
  //   ]);

  //   const num = keysEmployee[empCurrent.indexOf(res.empChoice)];
  //   const num2 = keysManager[managerCurrent.indexOf(res.managerChoice)];

  //   const sql = `UPDATE employee_names SET manager=${num2} WHERE id=${num}`;
  //   await connection.promise().query(sql);

  //   console.log("Employee updated successfully.");
  //   questions();
  // } catch (error) {
  //   console.error("Error updating employee:", error);
  // }
  try {
    const query = `
      SELECT employee_names.id, CONCAT(employee_names.first_name, ' ', employee_names.last_name), 
      FROM employee_names AS employee_names
      LEFT JOIN manager AS manager ON manager_id = manager.man_id
    `;

    const [results] = await connection.promise().query(query);
    console.log("results", results);

    const empCurrent = results.map((row) => row.employee_name);
    const keysEmployee = results.map((row) => row.id);
    const managerCurrent = results.map((row) => row.manager_name);

    const res = await inquirer.prompt([
      {
        type: "input",
        name: "confirm",
        message: "Are you sure you want to update an employee?",
        default: "yes",
      },
      {
        type: "list",
        name: "empChoice",
        message: "Which Employee would you like to update?",
        choices: empCurrent,
      },
      {
        type: "list",
        name: "managerChoice",
        message: "Who is the employee's manager?",
        choices: managerCurrent,
      },
    ]);

    const employeeId = keysEmployee[empCurrent.indexOf(res.empChoice)];
    const managerId = keysEmployee[empCurrent.indexOf(res.managerChoice)];

    const sql = `UPDATE employee_names SET manager_id = ${managerId} WHERE id = ${employeeId}`;
    await connection.promise().query(sql);

    console.log("Employee updated successfully.");
    questions();
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};
