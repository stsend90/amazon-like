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
    console.log("Connected as id: " + connection.threadId + "\n");
    managerMenu();
});

function managerMenu(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        managerOptions(res);
    });
};

function managerOptions (products){
    inquirer.prompt({
        type: "list",
        name: "choice",
        choices: [
            "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Products"],
        message: "What would you like to do?"    
        }).then(function(answer){
        switch (answer.choice){
            case "View Products for Sale":
                break;
            case "View Low Inventory":
                break;
            case "Add to Inventory":
                break;
            case "Add New Products":
                break;
            default:
                console.log("Thank you! and Goodbye!")
                process.exit(0);
                break;
        }
    });
};

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res){
      console.table(res);
      managerMenu();
    });
};

function addToInventory (inventory){
    console.table(inventory);
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase?",
        validate: function (answer) {
          return !isNaN(answer);
        }
    }]).then(function(answer){
        let choiceId = parseInt(answer.choice);
        let product = checkInventory(choiceId, inventory);
        if (products){
            managerForQuantity(product);
        } else {
            console.log("\nThat item is not in the inventory.");
        };
    });
};

function managerForQuantity (product){
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        validate: function(answer){
            return answer > 0;
        }
    }]).then(function(answer){
        let quantity = parseInt(answer.quantity);
    });
};

function addQuantity(product, quantity){
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [product.stock_quantity + quantity, products.item_id],
        function(err, res){
            console.log("\nSuccecfully added " + quantity + " " + product.product_name + "'s!\n");
            managerMenu();
        }
    );
};

function addProduct () {
    getDepartments(function(err, departments){
        productInfo(departments).then(insertProduct);
    });
};

function productInfo () {
    inquirer.prompt([{
        type: "input",
        name: "product_name",
        message: "Whats the name of product you would like to add?"
    },{
        type: "input",
        name: "department_name",
        choices: departmentsNames(departments),
        message: "Which department does this product go under?"
    },{
        type: "input",
        name: "price",
        message: "How much does it cost?",
        validate: function(answer){
            return answer > 0;
        }
    },{
        type: "input",
        name: "quantity",
        message: "How many do we have?",
        validate: function(answer){
            return !isNaN(answer);
        }
    }]);
};

function insertProduct (answer) {
    connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?,?,?,?)",
        [answer.product_name, answer.department_name, answer.price, answer.quantity],
        function (err, res){
            if (err) throw err;
            console.log(answer.product_name + " ADDED TO BAMAZON!\n");
            managerMenu();
        });
};

function getDepartments(cb){
    connection.query("SELECT * FROM departments", cb);
};

function departmentsNames(departments){
    return departments.map(function(department){
        return departments.department_name;
    });
};

function checkInventory(choiceId, inventory){
    for (let i = 0; inventory.length; i++){
        if (inventory[i].item_id === choiceId){
            return inventory[i];
        };
    } return null;
};