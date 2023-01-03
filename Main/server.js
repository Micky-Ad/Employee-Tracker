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
    } else if (choice == "Add employee") {
      addEmployee();
    } else if (choice == "Update Employee Role") {
      updateEmployee();
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

async function addRole() {
  var departmentList = await getDepartmentList();
  var departments = [];
  departmentList.forEach((department) => {
    departments.push(department.name);
  });

  var question2 = [
    {
      type: "list",
      name: "department",
      message: " Please select the department for this role ",
      choices: departments,
    },
  ];

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
  ];
  inquirer.prompt(question).then((answer) => {
    inquirer.prompt(question2).then((answers2) => {
      var title = answer.title;
      var salary = answer.salary;
      var department = answers2.department;
      var departmentId = null;
      departmentList.forEach((deprt) => {
        if (deprt.name == department) {
          departmentId = deprt.id;
        }
      });
      var sql = "INSERT INTO role(title,salary,department_id) VALUES (?,?,?)";
      console.log(title, salary, department, departmentId);
      db.query(sql, [title, salary, departmentId], (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Role Added to Database");
        }
      });
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

async function addEmployee() {
  var roleList = await getRoleList();
  var roles = [];
  roleList.forEach((role) => {
    roles.push(role.title);
  });

  var question2 = [
    {
      type: "list",
      name: "role",
      message: " Please select the role for this employee ",
      choices: roles,
    },
  ];

  // Manager Selection
  var managerList = await getEmployeeList();
  var managers = [];
  managerList.forEach((manager) => {
    managers.push(manager.first_name + " " + manager.last_name);
  });
  managers.push("none");
  var question3 = [
    {
      type: "list",
      name: "manager",
      message: " Please select the manager for this employee ",
      choices: managers,
    },
  ];

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
  ];

  // let answer = await inquirer(question);
  // let answer2 = await inquirer(question2);
  // let answer3 = await inquirer(question3)

  inquirer.prompt(question).then((answer) => {
    inquirer.prompt(question2).then((answer2) => {
      inquirer.prompt(question3).then((answer3) => {
        var managerName = answer3.manager;
        var managerId = null;
        managerList.forEach((mng) => {
          if (mng.first_name + " " + mng.last_name == managerName) {
            managerId = mng.id;
          }
        });
        var first_name = answer.first_name;
        var last_name = answer.last_name;
        var role = answer2.role;
        var roleId = null;
        roleList.forEach((rl) => {
          if (rl.title == role) {
            roleId = rl.id;
          }
        });

        var sql =
          "INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
        db.query(
          sql,
          [first_name, last_name, roleId, managerId],
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Employee added to Database");
            }
          }
        );
      });
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

function viewAllEmployees() {
  var sql =
    "SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name AS Department,role.salary,manager.first_name AS manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON manager.id=employee.manager_id";
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.table(res);
    }
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

async function getDepartmentList() {
  return new Promise(function (resolve, reject) {
    var sql = "SELECT * FROM department ";
    db.query(sql, (err, res) => {
      resolve(res);
    });
  });
}

async function getRoleList() {
  return new Promise(function (resolve, reject) {
    var sql = "SELECT * FROM role ";
    db.query(sql, (err, res) => {
      resolve(res);
    });
  });
}
runApp();
