const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const {prompt} = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'lab_db'
    },
    console.log(`Connected to the lab_db database.`)
  );

init()

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
        case "View All Employees": db.query('SELECT * FROM em')
          questions();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Quit":
          console.log("Goodbye!");
          break;
        default:
          console.log("Invalid choice. Please try again.");
          questions();
          break;
      }
    });
};

    

const init = () => {
    intoMessage(["Hello"])
    questions()
}
