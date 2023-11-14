CREATE VIEW roles_all AS
SELECT department.dept_id, job, salary, department.dept
FROM roles
LEFT JOIN department ON roles.department = department.id;

CREATE VIEW employee_interim   AS  
SELECT first_name,last_name, roles.job,manager.leader,roles.department,roles.salary
FROM employee_names
LEFT JOIN roles ON employee_names.roles = roles.id
LEFT JOIN manager ON employee_names.manager = manager.id;

CREATE VIEW employee_all AS
SELECT first_name,last_name,job,leader, department.dept,salary
From employee_interim
LEFT join department  on employee_interim.department=department.id; 