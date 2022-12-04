DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    id INT Not NULL AUTO_INCREMENT PRIMARY Key,
    dept_name VARCHAR(100) NOT NULL
);