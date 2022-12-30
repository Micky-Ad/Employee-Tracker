// Import and require inquirer
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
    password: "",
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
    var choice = answers.menu;
    if (choice == "View all employees") {
      viewAllEmployees();
    } else if (choice == "Add role") {
      addRole();
    } else if (choice == "Add Department") {
      addDepartment();
    } else if (choice == "View all departments") {
      veiwAllDepartments();
    } else if (choice == "View all roles") {
      veiwAllRoles();
    }
  });
}

function viewAllEmployees() {
  var sql = "SELECT * FROM employee ";
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.table(res);
    }
  });
}

function addDepartment() {
  var question = [
    {
      type: "input",
      name: "name",
      message: "enter the department name",
    },
  ];
  inquirer.prompt(question).then((answer) => {
    var name = answer.name;
    var sql = "INSERT INTO department(name) VALUES (?)";
    db.query(sql, [name], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Department Added to Database");
      }
    });
  });
}

function addRole() {
  var question = [
    {
      type: "input",
      name: "title",
      message: "enter the role name",
    },
    {
      type: "input",
      name: "salary",
      message: "enter the role's salary ",
    },
    {
      type: "input",
      name: "departmant",
      message: "enter the role's Department Id",
    },
  ];
  inquirer.prompt(question).then((answer) => {
    console.log(answer);
    var title = answer.title;
    var salary = answer.salary;
    var department = answer.department;
    var sql = "INSERT INTO role(title,salary,department_id) VALUES (?,?,?)";
    db.query(sql, [title, salary, department], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Role Added to Database");
      }
    });
  });
}

function veiwAllDepartments() {
  var sql = "SELECT * FROM department ";
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.table(res);
    }
  });
}

function veiwAllRoles() {
  var sql = "SELECT * FROM role ";
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.table(res);
    }
  });
}
runApp();
