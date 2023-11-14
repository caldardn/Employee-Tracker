CREATE VIEW roles_all AS
SELECT department.dept_id, job, salary, department.dept
FROM roles
LEFT JOIN department ON roles.department = department.dept_id;

CREATE VIEW employee_interim   AS  
SELECT first_name,last_name, roles.job,manager.leader,roles.department,roles.salary
FROM employee
LEFT JOIN roles ON employee.roles = roles.role_id
LEFT JOIN manager ON employee.manager = manager.man_id;

CREATE VIEW employee_all AS
SELECT first_name,last_name,job,leader, department.dept,salary
From employee_interim
LEFT join departments  on employee_interim.departments=departments.dept_idid; 

