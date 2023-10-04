-- Insert data into the department table
INSERT INTO department (name) VALUES
  ('Marketing'),
  ('Sales'),
  ('Finance'),
  ('Human Resources'),
  ('Engineering');

  -- Insert data into the role table
INSERT INTO role (title, salary, department_id) VALUES
  ('Marketing Manager', 60000.00, 1),
  ('Sales Representative', 50000.00, 2),
  ('Financial Analyst', 65000.00, 3),
  ('HR Coordinator', 55000.00, 4),
  ('Software Engineer', 75000.00, 5);

-- Insert data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Michael', 'Johnson', 3, 1),
  ('Emily', 'Davis', 4, NULL),
  ('David', 'Lee', 5, NULL);