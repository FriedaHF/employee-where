const inquirer = require('inquirer');
const db = require('./db/connection');

const employeeTracker = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'prompt',
                message: 'Select from the following.',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Log Out'
                ]
            }
        ])
        .then((answers) => {
            switch (answers.prompt) {
                case 'View all departments':
                    viewAll('department');
                    break;
                case 'View all roles':
                    viewAll('role');
                    break;
                case 'View all employees':
                    viewAll('employee');
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Log Out':
                    db.end();
                    console.log('Logged Out');
                    break;
                default:
                    console.log('Invalid choice');
            }
        });
};

const viewAll = (tableName) => {
    db.query(`SELECT * FROM ${tableName}`, (err, result) => {
        if (err) throw err;
        console.log(`Viewing all ${tableName}s`);
        console.table(result);
        employeeTracker();
    });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Enter department name',
                validate: (departmentInput) => {
                    return departmentInput ? true : 'Department input required';
                }
            }
        ])
        .then((answers) => {
            db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                if (err) throw err;
                console.log(`Added ${answers.department} to the database.`);
                employeeTracker();
            });
        });
};

const addRole = () => {
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'Enter role title',
                    validate: (roleInput) => roleInput ? true : 'Role input required'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary for the role',
                    validate: (salaryInput) => salaryInput ? true : 'Salary input required'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department for the role',
                    choices: result.map((department) => department.name)
                }
            ])
            .then((answers) => {
                const department = result.find((dep) => dep.name === answers.department);
                db.query(
                    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                    [answers.role, answers.salary, department.id],
                    (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`);
                        employeeTracker();
                    }
                );
            });
    });
};

const addEmployee = () => {
    db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the employee\'s first name',
                    validate: (firstNameInput) => firstNameInput ? true : 'First name input required'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the employee\'s last name',
                    validate: (lastNameInput) => lastNameInput ? true : 'Last name input required'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the employee\'s role',
                    choices: [...new Set(result.map((emp) => emp.title))]
                },
                {
                    type: 'input',
                    name: 'manager',
                    message: 'Enter the name of the employee\'s manager',
                    validate: (managerInput) => managerInput ? true : 'Manager input required'
                }
            ])
            .then((answers) => {
                const role = result.find((emp) => emp.title === answers.role);
                db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                    [answers.firstName, answers.lastName, role.id, answers.manager.id],
                    (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                        employeeTracker();
                    }
                );
            });
    });
};

const updateEmployeeRole = () => {
    db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select the employee whose role you want to update',
                    choices: [...new Set(result.map((emp) => emp.last_name))]
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the new role for the employee',
                    choices: [...new Set(result.map((emp) => emp.title))]
                }
            ])
            .then((answers) => {
                const name = result.find((emp) => emp.last_name === answers.employee);
                const role = result.find((emp) => emp.title === answers.role);
                db.query(
                    `UPDATE employee SET ? WHERE ?`,
                    [{ role_id: role.id }, { last_name: name.last_name }],
                    (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee}'s role in the database.`);
                        employeeTracker();
                    }
                );
            });
    });
};

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to Database');
    employeeTracker();
});
