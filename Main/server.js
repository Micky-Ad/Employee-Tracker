// Import and require inquirer
import e from "express";
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
    } else if (choice == "Add employee") {
      addEmployee();
    } else if (choice == "Update Employee Role") {
      updateEmployee();
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
      name: "department",
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
  var sql =
    "SELECT role.id,role.title, role.salary, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id ";
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.table(res);
    }
  });
}

function addEmployee() {
  var question = [
    {
      type: "input",
      name: "first_name",
      message: "enter the first name of employee ",
    },
    {
      type: "input",
      name: "last_name",
      message: "enter the last name of employee ",
    },
    {
      type: "input",
      name: "role_id",
      message: "enter the role id of the employee",
    },
    {
      type: "input",
      name: "manager_id",
      message: "enter the manager id for this employee",
    },
  ];
  inquirer.prompt(question).then((answer) => {
    console.log(answer);
    var first_name = answer.first_name;
    var last_name = answer.last_name;
    var role_id = answer.role_id;
    var manager_id = answer.manager_id;
    if (manager_id == "null" || manager_id == "") {
      manager_id = null;
    }
    var sql =
      "INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
    db.query(sql, [first_name, last_name, role_id, manager_id], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Employee added to Database");
      }
    });
  });
}

async function updateEmployee() {
  var employeeList = await getEmployeeList();
  var firstNames = [];
  employeeList.forEach((employee) => {
    firstNames.push(employee.first_name);
  });

  var question2 = [
    {
      type: "list",
      name: "employee",
      message: " Please select the employee that you want to update ",
      choices: firstNames,
    },
  ];
  inquirer.prompt(question2).then((answers2) => {
    var firstName = answers2.employee;
    var employeeId = null;
    employeeList.forEach((employee) => {
      if (employee.first_name == firstName) {
        employeeId = employee.id;
      }
    });
    var question = [
      {
        type: "input",
        name: "role_id",
        message: "enter the role id of the employee",
      },
    ];
    inquirer.prompt(question).then((answer) => {
      console.log(answer);

      var role_id = answer.role_id;

      var sql = "UPDATE employee SET role_id=? WHERE id=? ";
      db.query(sql, [role_id, employeeId], (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Employee role updated on the Database");
        }
      });
    });
  });
}

//  Waiting for the query to excute and return the results
async function getEmployeeList() {
  return new Promise(function (resolve, reject) {
    var sql = "SELECT * FROM employee ";
    db.query(sql, (err, res) => {
      resolve(res);
    });
  });
}
runApp();
