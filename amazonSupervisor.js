require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.USER_ID,
    password: process.env.PW_ID,
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startTable();
});

function startTable(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.table(res);
        popSupervisor();
    });
};

function popSupervisor(){
    inquirer.prompt([{
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["View product sales by Departments", "Create new Departments", "Exit"]
    }]).then(function(answer){
        switch (answer.choice){
            case "View product sales by Deoartments":
            viewSales();
            break;
            case "Create new Departments":
            newDepartments();
            break;
            case "Exit":
            console.log("Thank you, good bye!");
            connection.end();
        }
    });
};

function newDepartments (){
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "What is the name of the department?"
    },{
        type: "input",
        name: "overheadcost",
        message: "What is the overhead cost of the department?",
        validate: function(answer){
            return answer > 0;
        }
    }]).then(function(answer){
        connection.query("INSERT INTO departments (department_name, over_head_cost) VALUES (?,?)",
        [answer.name, answer.overhead],
        function(err){
            if (err) throw err;
            console.log("New department is added to Departments!");
            startTable();
        }
        );
    });
};

function viewSales(){
    connection.query("SELECT departProd.department_id, departProd.department_name, departProd.over_head_cost, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_cost) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_cost, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id", function(err, res){
        console.table(res);
        popSupervisor();
    })
}