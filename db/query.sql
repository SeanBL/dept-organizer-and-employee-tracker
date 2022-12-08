SELECT employees.id, employees.first_name, employees.last_name, roles.employee_title, departments.dept_name, roles.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager  

FROM employees FULL OUTER JOIN employees e2 ON e2.id = employees.manager_id
               JOIN roles ON employees.role_id = roles.id
               JOIN departments ON roles.department_id = departments.id
               