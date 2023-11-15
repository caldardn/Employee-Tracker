const express = require('express');
// const mysql = require('mysql2');
const connection = require('./config/connect');
// const validate = require('./validate/validate');
const inquirer = require("inquirer");
const { printTable } = require('console-table-printer')
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const questions = async () => {
  try {
    const res = await inquirer.prompt([
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
    ]);

    const choice = res.start;

    switch (choice) {
      case "View All Employees":
        const employees = await getAllEmployees();
        printTable(employees);
        break;

      case "Add An Employee":
        await addEmployee();
        break;

      case "Update Employee":
        await updateEmployee();
        break;

      case "View All Roles":
        const roles = await getAllRoles();
        printTable(roles);
        break;

      case "Add Role":
        await addRole();
        break;

      case "View All Departments":
        const departments = await getAllDepartments();
        printTable(departments);
        break;

      case "Add A Department":
        await addDept();
        break;

      case "Quit":
        quit();
        console.log("Goodbye!");
        return;

      default:
        console.log("Invalid choice");
        break;
    }

    return questions();
  } catch (err) {
    console.error(err);
  }
};

const getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM employee_all", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM roles_all", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllDepartments = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM department", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};



// Add employee
const addEmployee = async () => {
  try {
    const roles = await getRoles();
    const managers = await getManagers();

    const employeeData = await inquirer.prompt([
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
    ]);

    const role = roles.find((role) => role.job === employeeData.roleChoice);
    const manager = managers.find(
      (manager) => manager.leader === employeeData.managerChoice
    );

    await insertEmployee(employeeData.firstName, employeeData.lastName, role.role_id, manager.man_id);

    console.log("Employee added!");
    questions();
  } catch (err) {
    console.error(err);
  }
};

const getRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM roles", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getManagers = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM manager", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const insertEmployee = (firstName, lastName, roleId, managerId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO employee (first_name, last_name, roles, manager) VALUES (?, ?, ?, ?)";
    connection.query(sql, [firstName, lastName, roleId, managerId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// add role

const addRole = async () => {
  try {
    const departments = connection.query('SELECT * FROM department');
    const deptCurrent = departments.map((department) => department.dept);
    const keysDept = departments.map((department) => department.dept_id);

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'addRole',
        message: "What would you like to call the new role?",
      },
      {
        type: 'input',
        name: 'salary',
        message: "What is the role's salary?",
      },
      {
        type: 'list',
        name: 'deptChoice',
        message: "What is the role's department?",
        choices: deptCurrent,
      },
    ]);

    const deptIndex = deptCurrent.indexOf(answers.deptChoice);
    const departmentId = keysDept[deptIndex];

    const sql = `INSERT INTO roles(job, salary, department) VALUES('${answers.addRole}', ${answers.salary}, ${departmentId})`;
    await connection.query(sql);
    console.log('Role added successfully.');

    initialQuestions();
  } catch (error) {
    console.error('Error adding role:', error);
  }
}

// add department



app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
 
  const quit = () => {
    console.log("Goodbye!");
    process.exit();
  };

const init = () => {
    // intoMessage(["Hello"])

    questions()
}
init()