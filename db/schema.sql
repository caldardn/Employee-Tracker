DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE departments (
   id INT AUTO_INCREMENT PRIMARY KEY,
   dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE manager (
  man_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  leader VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job VARCHAR(30),
    salary DECIMAL(8,2),
    department INT,
    FOREIGN KEY (department) REFERENCES departments(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager INT,
    FOREIGN KEY (manager) REFERENCES manager(man_id), 
    roles INT,
    FOREIGN KEY (roles) REFERENCES roles(id)
);