DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept VARCHAR(30) NOT NULL
);

CREATE TABLE manager (
  man_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  leader VARCHAR(30) NOT NULL
);


CREATE TABLE roles (
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  job VARCHAR(30) NOT NULL,
  salary DECIMAL(8,2),
  department INT,
  FOREIGN KEY (department)
  REFERENCES department(dept_id)
  );

CREATE TABLE employee_names (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
   manager INT,
  FOREIGN KEY (manager)
  REFERENCES manager(man_id), 
  roles INT,
  FOREIGN KEY (roles)
  REFERENCES roles(role_id)
);


-- SELECT employee_names.first_name, employee_names.last_name, roles.job, roles.salary
-- FROM employee_names
-- INNER JOIN roles
-- ON employee_names.roles = roles.role_id;