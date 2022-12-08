const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1Takamichi!',
    database: 'employee_db'
});

connection.connect(function (err) {
    if(err) throw err;
})

mainPrompt();
function mainPrompt() {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'departments',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', "View All Roles", "Add Role", "View All Departments", "Add Department", "quit"]
        }
    ])
    .then((response) => {
            if (response.departments === "quit") {
                console.log("Good Bye!");
            } else if (response.departments === "View All Departments") {
                console.log("test");
                viewAllDept();
            } else if (response.departments === "View All Roles") {
                viewAllRoles();
            } else if (response.departments === "View All Employees") {
                viewAllEmployees();
            }
    });
}

function viewAllDept() {
    let query = "SELECT departments.id, departments.dept_name FROM departments";
    connection.query(query, (err, result) => {
        //console.log(result);
        if (err) throw err;

        // let departmentArry = [];

        // for (let i = 0; i < result.length; i++) {
        //     departmentArry.push(result[i].departments.id);
        //     departmentArry.push(result[i].departments.dept_name);
        // }
        // console.log(departmentArry);
        //const deptTable = cTable.
        
         console.table(result);
         mainPrompt();
        // console.table(['id', 'department'], departmentArry);
    });
};

function viewAllRoles() {
    let query = "SELECT roles.id, roles.employee_title, roles.department_id, roles.salary FROM roles";

    connection.query(query, (err, result) => {
        console.log(result);
        //console.log(roles.id)
        if (err) throw err;

        console.table(result);
        mainPrompt();
    });
};

function viewAllEmployees() {
    let query = "SELECT employees.id, employees.first_name, employees.last_name, employees.role_id, employees.manager_id FROM employees";

    connection.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        mainPrompt();
    })
}






