-- Departments
INSERT INTO department (name) VALUES
  ('Finance'),
  ('Marketing'),
  ('Information Technology'),
  ('Creative Arts');

-- Roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Financial Analyst', 90000, 1),
  ('Marketing Specialist', 75000, 2),
  ('IT Specialist', 100000, 3),
  ('Graphic Designer', 60000, 4);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('David', 'Anderson', 1, 3),
  ('Emily', 'Smith', 2, 4),
  ('Daniel', 'Johnson', 3, 1),
  ('Sophia', 'Brown', 4, 2);
