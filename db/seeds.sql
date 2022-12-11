INSERT INTO departments (dept_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (employee_title, department_id, salary)
VALUES ("Sales Lead", 1, 100000),
       ("Salesperson", 1, 80000),
       ("Lead Engineer", 2, 150000),
       ("Software Engineer", 2, 120000),
       ("Account Manager", 3, 160000),
       ("Accountant", 3, 125000),
       ("Legal Team Lead", 4, 250000),
       ("Lawyer", 4, 190000),
       ("Lawyer", 4, 180000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Oliver", "Cromwell", 1, null),
       ("Morticia", "Adams", 2, 1),
       ("John", "Dickenson", 3, null),
       ("Floor", "Jansen", 4, 3),
       ("Clark", "Kent", 5, null),
       ("Bom", "Park", 6, 5),
       ("Aimee", "Mullins", 7, null),
       ("Tim", "Henson", 8, 7),
       ("Test", "Test", 9, 7);