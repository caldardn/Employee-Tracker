CREATE VIEW roles_all AS
SELECT department.dept_id, job, salary, department.dept
FROM roles
LEFT JOIN department ON roles.department = department.dept_id;

CREATE VIEW employee_interim   AS  
SELECT first_name,last_name, roles.job,manager.leader,roles.department,roles.salary
FROM employee_names
LEFT JOIN roles ON employee_names.roles = roles.role_id
LEFT JOIN manager ON employee_names.manager = manager.man_id;

CREATE VIEW employee_all AS
SELECT 
first_name,
last_name,
job,leader, 
department.dept,
salary
FROM employee_interim
LEFT JOIN department  ON employee_interim.department=department.dept_id; 
-- CREATE VIEW employee_all AS
-- SELECT
--   employee_names.first_name,
--   employee_names.last_name,
--   roles.job,
--   manager.leader,
--   department.dept,
--   roles.salary
-- FROM
--   employee_names
--   LEFT JOIN roles ON employee_names.roles = roles.role_id
--   LEFT JOIN manager ON employee_names.manager = manager.man_id
--   LEFT JOIN department ON roles.department = department.dept_id;
