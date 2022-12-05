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




