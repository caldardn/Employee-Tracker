const express = require('express');
// const mysql = require('mysql2');
const connection = require('./config/connect');
const inquirer = require("inquirer");
// const { printTable } = require('console-table-printer')
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
          "Update Employee Role",
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
          console.table(res)
        })
        //   return questions();
        // case "Add An Employee":
        //   addEmployee();
        //   break;
        // case "Update Employee Role":
        //   updateEmployeeRole();
        //   break;
        // case "View All Roles":
        //   viewAllRoles();
        //   break;
        // case "Add Role":
        //   addRole();
        //   break;
        // case "View All Departments":
        //   viewAllDepartments();
        //   break;
        // case "Add A Department":
        //   addDepartment();
        //   break;
        // case "Quit":
        // quit();
        // console.log("Goodbye!");
        
       
      }
    });
};
// const addEmployee = () => {
//   inquirer.prompt([
    
    
//   ])
// }

// app.listen(PORT, () => {
//     console.log(`Server running on port http://localhost:${PORT}`);
//   });
 
  // const quit = () => {
  //   console.log("Goodbye!");
  //   process.exit();
  // };

const init = () => {
    // intoMessage(["Hello"])

    questions()
}
init()