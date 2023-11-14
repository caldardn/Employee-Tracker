const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
const { prompt } = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "lab_db",
  },
  console.log(`Connected to the lab_db database.`)
);

init();

const questions = () => {
    prompt([{
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
           "View All Employees",
           "Add An Employee",
           "Update Employee Role",
           "View All Roles",
           "Add Roll",
           "View All Departments",
           "Add A Department", 
           "Quit",
        ]
    }])
}

const init = () => {
  intoMessage(["Hello"]);
  questions();
};
