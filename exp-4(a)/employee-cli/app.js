// imports
const fs = require('fs');
const readline = require('readline');

// CLI setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// load data
let employees = [];

if (fs.existsSync('employees.json')) {
    const data = fs.readFileSync('employees.json');
    employees = JSON.parse(data);
}

// SAVE FUNCTION
function saveEmployees() {
    fs.writeFileSync('employees.json', JSON.stringify(employees, null, 2));
}

// ADD EMPLOYEE
function addEmployee() {

    rl.question("Enter ID: ", (id) => {

        if (employees.find(emp => emp.id == id)) {
            console.log("Employee with this ID already exists!");
            return menu();
        }

        rl.question("Enter Name: ", (name) => {
            rl.question("Enter Role: ", (role) => {
                rl.question("Enter Salary: ", (salary) => {

                    if (isNaN(salary)) {
                        console.log("Salary must be a number!");
                        return menu();
                    }

                    employees.push({
                        id: Number(id),
                        name,
                        role,
                        salary: Number(salary)
                    });

                    saveEmployees();
                    console.log("✅ Employee Added Successfully!");
                    menu();
                });
            });
        });
    });
}

// VIEW EMPLOYEES
function viewEmployees() {
    console.table(employees);
    menu();
}

// DELETE EMPLOYEE
function deleteEmployee() {

    rl.question("Enter Employee ID to delete: ", (id) => {

        const before = employees.length;
        employees = employees.filter(emp => emp.id != id);

        if (employees.length === before) {
            console.log("Employee not found!");
        } else {
            saveEmployees();
            console.log("✅ Employee Deleted!");
        }

        menu();
    });
}

// UPDATE EMPLOYEE
function updateEmployee() {

    rl.question("Enter Employee ID to update: ", (id) => {

        const emp = employees.find(e => e.id == id);

        if (!emp) {
            console.log("Employee not found!");
            return menu();
        }

        rl.question("Enter new role: ", (role) => {
            rl.question("Enter new salary: ", (salary) => {

                emp.role = role;
                emp.salary = Number(salary);

                saveEmployees();
                console.log("✅ Employee Updated!");
                menu();
            });
        });
    });
}


// ⭐⭐⭐ MOST IMPORTANT FUNCTION
function menu() {

    console.log(`
===== Employee Management =====
1. Add Employee
2. View Employees
3. Update Employee
4. Delete Employee
5. Exit
`);

    rl.question("Choose an option: ", (choice) => {

        switch(choice) {

            case '1':
                addEmployee();
                break;

            case '2':
                viewEmployees();
                break;

            case '3':
                updateEmployee();
                break;

            case '4':
                deleteEmployee();
                break;

            case '5':
                console.log("Goodbye 👋");
                rl.close();
                break;

            default:
                console.log("Invalid choice!");
                menu();
        }
    });
}

// ALWAYS CALL MENU AT LAST
menu();
