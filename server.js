const express = require("express");
const connection = require("./config/connect");
// const validate = require('./validate/validate');
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
const chalk = require('chalk');
const figlet = require('figlet');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connection.connect((error) => {
  if (error) throw error;
  console.log(chalk.magentaBright.bold(`====================================================================================`));
  console.log(``);
  console.log(chalk.blueBright.bold(figlet.textSync('Employee Tracker')));
  console.log(``);
  console.log(chalk.greenBright.bold('Created By: David Caldarone'));
  console.log(``);
  console.log(chalk.magentaBright.bold(`====================================================================================`));
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
            console.log(chalk.magentaBright.bold(`====================================================================================`));
            console.log(`                              ` + chalk.blue.bold("Employees List"));
            console.log(chalk.magentaBright.bold(`====================================================================================`));
            console.table(results);
            console.log(chalk.magentaBright.bold(`====================================================================================`));
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
              console.log(chalk.magentaBright.bold(`====================================================================================`));
              console.log(`                              ` + chalk.blue.bold("All Roles"));
              console.log(chalk.magentaBright.bold(`====================================================================================`));
              console.table(results);
              console.log(chalk.magentaBright.bold(`====================================================================================`));
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
              console.log("\n");
              console.log(chalk.magentaBright.bold(`====================================================================================`));
              console.log(`                              ` + chalk.blue.bold("All Departments"));
              console.log(chalk.magentaBright.bold(`====================================================================================`));
              console.table(results);
              console.log(chalk.magentaBright.bold(`====================================================================================`));
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

//add employee

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
          const manager = managers.find(
            (manager) => manager.leader === employeeData.managerChoice
          );
         

          const sql =
            "INSERT INTO employee_names (first_name, last_name, roles, manager) VALUES (?, ?, ?, ?)";
          connection.query(sql, [
            employeeData.firstName,
            employeeData.lastName,
            role.role_id,
            manager.man_id,
          ]);

          console.log(chalk.magentaBright.bold(`====================================================================================`));
          console.log(chalk.blueBright(`Employee successfully added!`));
          console.log(chalk.magentaBright.bold(`====================================================================================`));
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
      console.log(chalk.magentaBright.bold(`====================================================================================`));
      console.log(chalk.blueBright(`Role added successfully!`));
      console.log(chalk.magentaBright.bold(`====================================================================================`));
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

    console.log(chalk.magentaBright.bold(`====================================================================================`));
    console.log(chalk.blueBright(`Department successfully added!`));
    console.log(chalk.magentaBright.bold(`====================================================================================`));
  
  } catch (error) {
    console.error("Error adding department:", error);
  }
};

// update employee

const updateEmployee = async () => {
  
  try {
    const query = `
      SELECT employee_names.id, CONCAT(employee_names.first_name, ' ', employee_names.last_name) AS employee_name
      FROM employee_names
    `;
    const [results] = await connection.promise().query(query);
    const empCurrent = results.map((row) => row.employee_name);
    const keysEmployee = results.map((row) => row.id);
  
    const rolesQuery = `
      SELECT role_id, job
      FROM roles
    `;
    const [rolesResults] = await connection.promise().query(rolesQuery);
  
    const rolesChoices = rolesResults.map((row) => row.job);
  
    const res = await inquirer.prompt([
      {
        type: "list",
        name: "empChoice",
        message: "Which employee would you like to update?",
        choices: empCurrent,
      },
      {
        type: "list",
        name: "roleChoice",
        message: "Select the new role for the employee:",
        choices: rolesChoices,
      },
    ]);
  
    const employeeId = keysEmployee[empCurrent.indexOf(res.empChoice)];
    const roleId = rolesResults.find((row) => row.job === res.roleChoice).role_id;
  
    const sql = `UPDATE employee_names SET roles = ${roleId} WHERE id = ${employeeId}`;
    await connection.promise().query(sql);
    console.log(chalk.magentaBright.bold(`====================================================================================`));
    console.log(chalk.blueBright(`Employee successfully updated!`));
    console.log(chalk.magentaBright.bold(`====================================================================================`));

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
