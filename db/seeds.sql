INSERT INTO departments (dept) VALUES 
   ("Molecular genomics"),
   ("Flow cytometry"),
   ("Cell culture"), 
   ("Immunohistochemistry"),
   ("Vaccines");

INSERT INTO manager (leader) VALUES 
   ("Jen"),
   ("Sheena"),
   ("Michele"), 
   ("Joe"),
   ("Lee");


INSERT INTO roles (job, salary, department) VALUES 
   ("Group Leader", 90000, 1),
   ("Scientist", 64000, 3),
   ("Quality Assurance", 60000, 2), 
   ("Research Scientist", 80000, 5),
   ("Manager", 105500, 4);

INSERT INTO employee (first_name, last_name, manager, roles) VALUES 
   ("Landon", "Mccormick", 4, 5),
   ("Avery", "Cox", 1, 3),
   ("Jaiden", "Williams", 3, 2), 
   ("Summer", "Bledsoe", 2, 1),
   ("Arianna", "Brown", 4, 5);