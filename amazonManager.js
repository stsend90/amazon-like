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
    start();
});
function start() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add Inventory",
                    "Add New Product",
                    "Exit"
                ]
            }
        ])
        .then(function (answer) {
            switch (answer.choice) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProducts();
                    break;
                case "Exit":
                    console.log("\n==============================\n");
                    console.log("Good work, thank you!")
                    console.log("\n==============================\n");
                    connection.end();
                    break;
                default:
                    console.log("\n==============================\n");
                    console.log("I don't recognize that command; please try again");
                    console.log("\n==============================\n");
                    start();
                    break;
            }
        });
}
function viewProducts() {
    connection.query("SELECT * FROM products WHERE stock_quantity >= 0 ", function (
        err,
        res
    ) {
        if (err) throw err;
        console.table(res);
        start();
    });
}
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5 ", function (err,res) {
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "list",
                    message: "What would you like to do?",
                    choices: ["Add Inventory", "Back to main menu", "Exit"]
                }
            ])
            .then(function (answer) {
                switch (answer.choice) {
                    case "Add Inventory":
                        addInventory();
                        break;
                    case "Back to main menu":
                        start();
                        break;
                    case "Exit":
                        connection.end();
                        break;
                    default:
                        console.log("\n==============================\n");
                        console.log("I do not recognize that command; please try again");
                        console.log("\n==============================\n");
                        start();
                        break;
                }
            });
    });
};
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        let resArr = [];
        for (let i = 0; i < res.length; i++) {
            resArr.push(res[i].product_name);
        };
        inquirer.prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: resArr,
                    message: "Which item would you like to add inventory to?"
                },{
                    type: "input",
                    name: "amount",
                    message: "Please enter a quantity?",
                    validate: function (val) {
                        if (isNaN(val) === false) {
                            return true;
                        } else {
                            console.log("\n==============================\n")
                            console.log("Please enter a number!");
                            console.log("\n==============================\n")
                            return false;
                        };
                    }
                }
            ]).then(function (answer) {
                let chosenItem;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        chosenItem = res[i];
                        console.log(chosenItem);
                    };
                };
                let amount = parseInt(answer.amount) + parseInt(chosenItem.stock_quantity);
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: amount
                        },
                        {
                            product_name: answer.choice
                        }
                    ],
                    function(err) {
                        if (err) throw err;
                        console.log("\n==============================\n")
                        console.log("Product Updated!");
                        console.log("\n==============================\n")
                        start();
                    }
                );
            });
    });
};
function addProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([{
                    type: "input",
                    name: "item",
                    message: "What is the name of your product?"
                    },
                    {
                    type: "input",
                    name: "department",
                    message: "Which department does it belong to?"
                    },
                    {
                    type: "input",
                    name: "price",
                    message: "What is the price of the product?",
                    validate: function (val) {
                        if (isNaN(val) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }},
                    {
                    type: "input",
                    name: "quantity",
                    message: "How many of the product did we receive?",
                    validate: function (val) {
                        if (isNaN(val) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ]).then(function (answer) {
                console.log("\n==============================\n");
                console.log(answer);
                console.log("Inserting a new product...");
                console.log("\n==============================\n");
                let query = connection.query(
                    "INSERT INTO products SET ?",
                    {
                        product_name: answer.item,
                        department_name: answer.department,
                        price: answer.price,
                        stock_quantity: answer.quantity
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("\n==============================\n");
                        console.log(res.affectedRows + " product inserted!");
                        console.log("Selecting all products...");
                        console.log("\n==============================\n");
                        connection.query("SELECT * FROM products", function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start();
                        });
                    }
                );
            });
    });
};