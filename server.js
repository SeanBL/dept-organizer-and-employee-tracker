const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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
            } else {
                console.log("test");
                mainPrompt();
            }
    });
}

mainPrompt();


