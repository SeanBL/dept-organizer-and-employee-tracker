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
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Delete Employee', 'View All Roles', 'Add Role', 'Delete Role', 'View All Departments', 'Add Department', 'Delete Department', 'quit']
        }
    ])
    .then((response) => {
            if (response.departments === "quit") {
                console.log("Good Bye!");
            } else if (response.departments === "View All Departments") {
                viewAllDept();
            } else if (response.departments === "View All Roles") {
                viewAllRoles();
            } else if (response.departments === "View All Employees") {
                viewAllEmployees();
            } else if (response.departments === "Add Department") {
                addDepartment();
            } else if (response.departments === "Add Role") {
                addRole();
            } else if (response.departments === "Add Employee") {
                addEmployee();
            } else if (response.departments === "Update Employee Role") {
                updateEmployeeRole();
            } else if (response.departments === "Delete Employee") {
                deleteEmployee();
            } else if (response.departments === "Delete Role") {
                deleteRole();
            } else if (response.departments === "Delete Department") {
                deleteDept();
            }
    });
}

function viewAllDept() {
    let query = "SELECT departments.id, departments.dept_name FROM departments";
    connection.query(query, (err, result) => {
        if (err) throw err;

         console.table(result);
         mainPrompt();
        
    });
};

function viewAllRoles() {
    let query = `SELECT roles.id, roles.employee_title AS title, departments.dept_name AS department, roles.salary 

    FROM roles
    
    LEFT JOIN departments ON roles.department_id = departments.id`;

    connection.query(query, (err, result) => {
        if (err) throw err;

        console.table(result);
        mainPrompt();
    });
};

function viewAllEmployees() {
    let query = `SELECT 
    employees.id, 
    employees.first_name, 
    employees.last_name, 
    roles.employee_title AS title, 
    departments.dept_name AS department, 
    roles.salary, 
    CONCAT(e2.first_name, ' ', e2.last_name) AS manager 
    
    FROM employees 
    
    LEFT JOIN employees e2 ON e2.id = employees.manager_id 
    LEFT JOIN roles ON employees.role_id = roles.id 
    LEFT JOIN departments ON roles.department_id = departments.id`;

    connection.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        mainPrompt();
    })
}

 
function addDepartment() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'newDept',
            message: 'What is the name of the department?'
        }
    ])
    .then((response) => {
        let query = "INSERT INTO departments SET ?";
        connection.query(query, {dept_name: response.newDept}, (err, result) => {
            if (err) throw err;
            console.log("The new department has been added.");
            mainPrompt();
        })
    });
};

function addRole() {
    let query = "SELECT * FROM departments";

    connection.query(query, function (err, result) {
        let deptArry = [];
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            deptArry.push(result[i].dept_name);
        }
        
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'newRoleTitle',
                message: 'Please enter the new role title.'
            },
            {
                type: 'input',
                name: 'newSalary',
                message: 'Please enter the correct salary for the role.'
            },
            {
                type: 'list',
                name: 'roleDept',
                message: 'Please select the correct dept for this role',
                choices: deptArry
            }
        ])
        .then((response) => {
            let query = "SELECT * FROM departments WHERE ?"; 

            connection.query(query, {dept_name: response.roleDept}, function (err, result) {
                if (err) throw err;
                let query2 = "INSERT INTO roles SET ?";

                connection.query(query2, {employee_title: response.newRoleTitle, salary: response.newSalary, department_id: result[0].id }, function (err, result) {
                    if (err) throw err,
                    console.log("New Role has been added.");
                    mainPrompt();
                });
            });
        });
    });
};


function addEmployee() {
    
    let query = `SELECT * FROM roles`;

    connection.query(query, (err, result) => {
        if (err) throw err;
        
        let titlesArry = [];
        for (let i = 0; i < result.length; i++) {
            titlesArry.push(result[i].employee_title);
        }

        function titleSet(arr) {
            return [...new Set(arr)];
        }

        inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Please enter the first name.'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Please enter the last name.'
            },
            {
                type: 'list',
                name: 'role',
                message: 'Please select the employee\'s title.',
                choices: titleSet(titlesArry)
            }
            
        ])
        .then((response) => {
            let query = `SELECT * FROM roles WHERE ?`;

            connection.query(query, {employee_title: response.role}, (err, result) => {
                if (err) throw err;

                let query2 = `INSERT INTO employees SET ?`

                connection.query(query2, {first_name: response.firstName, last_name: response.lastName, role_id: result[0].id}, (err, result) => {
                    if (err) throw err;
                    
                    //process.exit(0);
                    //console.log(result.insertId);
                    addManager(result.insertId);
                })
                
            });
        });
    });  
};

function addManager(employeeId) {
    let query = `SELECT * FROM employees`;
    
    connection.query(query, (err, result) => {
        if (err) throw err;
        let managerArry = ["none"];
        for (let i = 0; i < result.length; i++) {
            managerArry.push(result[i].first_name + " " + result[i].last_name);
            //console.log(managerArry);
        }

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Please select this employee\'s manager',
                choices: managerArry
            }
        ])
        .then((response) => {
            let query = `Select * FROM employees WHERE ?`
            // let fullName = response.manager;
            // let nameParts = fullName.split(" ");
            // let firstName = nameParts[0];
            connection.query(query, {first_name: response.manager.split(" ")[0]}, (err, result) => {
                if (err) throw err;
                
                let managerId;
                if (response.manager === "none") {
                    managerId = null;
                } else {
                    managerId = result[0].id;
                }
                
                let query2 = `UPDATE employees SET manager_id=${managerId} WHERE id=${employeeId}`;
                
                connection.query(query2, (err, result) => {
                    if (err) throw err;
                    console.log("The new employee has been added.");
                    mainPrompt();
                });
            });
        });
    });
};

function updateEmployeeRole() {
    let query = `SELECT * FROM employees`;

    connection.query(query, (err, result) => {
        let employeesArry = [];
        for (let i = 0; i < result.length; i++) {
            employeesArry.push(result[i].first_name + " " + result[i].last_name);
        }

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employees',
                message: 'Whose role do you wish to update?',
                choices: employeesArry
            }
        ])
        .then((response) =>  {
            let query = `SELECT * FROM employees WHERE ?`;
            connection.query(query, {first_name: response.employees.split(" ")[0]}, (err, result) => {
                if (err) throw err;
                
                let employeeIdNum = result[0].id;
                let query2 = `SELECT * FROM roles`;
                connection.query(query2, (err, result) => {
                    let titlesArry = [];
                    for (let i = 0; i < result.length; i++) {
                        titlesArry.push(result[i].employee_title);
                    }
                    function titleSet(arr) {
                        return [...new Set(arr)];
                    }
                    console.log(titleSet(titlesArry));

                    inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'roleList',
                            message: 'Which role do you want to assign the selected employee?',
                            choices: titleSet(titlesArry)
                        }
                    ])
                    .then((response) => {
                        
                        let query = `SELECT * FROM roles WHERE ?`;

                        connection.query(query, {employee_title: response.roleList}, (err, result) =>{
                            if (err) throw err;
    
                            let roleId = result[0].id;
                            let query2 = `UPDATE employees SET role_id = ${roleId} WHERE id = ${employeeIdNum}`;
                            connection.query(query2, (err, result) => {
                                console.log("The new employee role has been updated.");
                                mainPrompt();
                            });
                            
                        });
                    });
                });
            });
        });
    });
};

function deleteEmployee() {
    let query = `SELECT * FROM employees`;
    let employeeArry = [];
    connection.query(query, (err, result) => {
        for (let i = 0; i < result.length; i++) {
            employeeArry.push(result[i].first_name + " " + result[i].last_name);
        }

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employees',
                message: 'Select an employee to remove from the database.',
                choices: employeeArry
            }
        ])
        .then((response) => {
            let query = `SELECT * FROM employees WHERE ?`;
            connection.query(query, {first_name: response.employees.split(" ")[0]}, (err, result) => {
                if (err) throw err;
                let query2 = `DELETE FROM employees WHERE id = ${result[0].id}`;
                connection.query(query2, (err, result) => {
                    if (err) throw err;
                    console.log(response.employees + " has been removed from the database.");
                    mainPrompt();
                });
            });
        });
    });
};

function deleteRole() {
    let query = `SELECT * FROM roles`;
    
    connection.query(query, (err, result) => {
        let rolesArry = [];
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            rolesArry.push(result[i].employee_title);
        }

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'roleList',
                message: 'Select a role to remove from the database.',
                choices: rolesArry
            }
        ])
        .then((response) => {
            let query = `SELECT * FROM roles WHERE ?`;
            connection.query(query, {employee_title: response.roleList}, (err, result) => {
                if (err) throw err;
                let query2 = `DELETE FROM roles WHERE id = ${result[0].id}`;
                connection.query(query2, (err, result) => {
                    if (err) throw err;
                    console.log(response.roleList + " has been removed from the database.")
                    mainPrompt();
                });
            });
        });
    });
};

function deleteDept() {
    let query = `SELECT * FROM departments`;

    connection.query(query, (err, result) => {
        let deptArry = [];
        for (let i = 0; i < result.length; i++) {
            deptArry.push(result[i].dept_name);
        }

        inquirer.prompt([
            {
                type: 'list',
                name: 'deptList',
                message: 'Select a department to remove from the database.',
                choices: deptArry
            }
        ])
        .then((response) => {
            let query = `SELECT * FROM departments WHERE ?`;
            connection.query(query, {dept_name: response.deptList}, (err, result) => {
                let query2 = `DELETE FROM departments WHERE id = ${result[0].id}`;
                connection.query(query2, (err, result) => {
                    if (err) throw err;
                    console.log(response.deptList + " has been removed from the database.");
                    mainPrompt();
                });
            });
        });
    });
};

