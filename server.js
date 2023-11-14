const express = require('express');
// const mysql = require('mysql2');
const connection = require('./config/connect');
const validate = require('./validate/validate');
const inquirer = require("inquirer");
const { printTable } = require('console-table-printer')
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const db = mysql.createConnection(
//     {
//       host: 'localhost',
//       user: 'root',
//       password: '',
//       database: 'lab_db'
//     },
//     console.log(`Connected to the lab_db database.`)
//   );



const questions = () => {
  inquirer.prompt([
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
      let choice = res.start
      switch (choice) {
        case "View All Employees": connection.query('SELECT * FROM employee', function (err, res) {
          if (err) {
            console.error(err)
            return
          }
          // console.table(res)
          printTable(res)
        })
          return questions();

        case "Add An Employee": addEmployee();
        break;
          
        case "Update Employee": updateEmployee()
        break;
          
        case "View All Roles": connection.query('SELECT * FROM roles_all', function (err, res) {
          if (err) {
            console.error(err)
            return
          }
          // console.table(res)
          printTable(res)
        })
          return questions();
         
        case "Add Role": addRole();
        break;
          
        case "View All Departments": connection.query('SELECT * FROM department', function (err, res) {
          if (err) {
            console.error(err)
            return
          }
          // console.table(res)
          printTable(res)
        })
          return questions();
          
        case "Add A Department": addDept()
        break;
          
        case "Quit":
        quit();
        console.log("Goodbye!");
        
       
      }
    });
};
const addEmployee = () => {
  // Query the database outside the prompt
  connection.query('SELECT * FROM roles', function (err, results) {
    let rolesCurrent = [];
    let keysRoles = [];
    for (let i = 0; i < results.length; i++) {
      rolesCurrent[i] = results[i].job;
      keysRoles[i] = results[i].role_id;
    }

    connection.query('SELECT * FROM manager', function (err, results) {
      let managerCurrent = [];
      let keysManager = [];
      for (let i = 0; i < results.length; i++) {
        managerCurrent[i] = results[i].leader;
        keysManager[i] = results[i].man_id;
      }

      // Now that we have the data from the database, we can prompt the user
      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
          // validate: addFirstName => {
          //   if (addFirstName) {
          //     return true;
          //   } else {
          //     console.log("Please enter the employee's first name!");
          //     return false;
          //   }
          // }
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
          // validate: addLastName => {
          //   if (addLastName) {
          //     return true;
          //   } else {
          //     console.log("Please enter the employee's last name!");
          //     return false;
          //   }
          // }
        },
        {
          type: "list",
          name: "roleChoice",
          message: "What is the employee's role?",
          choices: rolesCurrent
        },
        {
          type: "list",
          name: "managerChoice",
          message: "Who is the employee's manager?",
          choices: managerCurrent
        }
      ])
      .then((res) => {
        let roleID = keysRoles[rolesCurrent.indexOf(res.roleChoice)];
        let managerID = keysManager[managerCurrent.indexOf(res.managerChoice)];
        let sql = `INSERT INTO employee (first_name, last_name, roles, manager) VALUES ("${res.firstName}", "${res.lastName}", ${roleID}, ${managerID})`;
      
        connection.query(sql, function (err, res) {
          if (err) {
            console.error(err)
            return
          }
          console.log("Employee added!");
          questions();
        });
      });
    });
  });
};

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