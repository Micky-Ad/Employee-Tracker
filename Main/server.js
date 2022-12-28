// Adding inquirer
import inquirer from "inquirer";
// Import and require mysql2

import mysql from "mysql2";

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "2222",
    database: "employee_tracker_db",
  },
  console.log(`Connected to the employee_tracker database.`)
);

function runApp() {
  menu();
}

function menu() {
  var questions = [
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "Add employee",
        "Update Employee Role",
        "View all roles",
        "Add role",
        "View all departments",
        "Add Department",
      ],
    },
  ];
  inquirer.prompt(questions).then((answers) => {
    console.log(answers);
  });
}

runApp();
