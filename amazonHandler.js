require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const console_table = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.USER_ID,
    password: process.env.PW_ID,
    database: "bamazonDB"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId + "\n");
});

var run = function() {
    // query the database for all products available for purchase
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // once you have the products, prompt the user for which they'd like to purchase
        inquirer.prompt([
            {
                name: "select",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                message: "What would you like to do?"
            }
        ]).then(function(answer) {

            switch (answer.select) {
                case "View Products for Sale":
                    connection.query("SELECT * FROM products", function(err, results) {
                        if (err) throw err;
                        console.table(results);
                        run();
                    });
                    break;
                case "View Low Inventory":
                    connection.query("SELECT * FROM products WHERE stock_quantity < 100", function(err, results) {
                        if (err) throw err;
                        console.table(results);
                        run();
                    });
                    break;
                case "Add to Inventory":
                    inquirer.prompt([
                    {
                        name: "productID",
                        type: "list",
                        choices: function() {
                            var choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(results[i].product_name);
                            }
                            return choiceArray;
                        },
                        message: "Choose the product that you would like to stock:"
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "How much would you like to add?"
                    }
                    ]).then(function(answerTwo){
                        var chosenProduct;
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].product_name === answerTwo.product) {
                                chosenProduct = results[i];
                            }
                        }

                        connection.query("UPDATE products SET ? WHERE ?", [
                        {
                            stock_quantity: chosenProduct.stock_quantity + parseInt(answerTwo.quantity)
                        },
                        {
                            id: chosenProduct.id
                        }], function(error) {
                            if (error) throw err;
                            console.log("Stock added successfully!");
                        })
                    })
            }
        });
    });
};

run();