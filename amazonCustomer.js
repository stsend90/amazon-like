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
    loadProducts();
});

function loadProducts() {
    connection.query("SELECT * FROM products", function(err, answer) {
      if (err) throw err;
  
      console.table(answer);
  
      promptCustomerForItem(answer);
    });
  }
  
  function promptCustomerForItem(inventory) {
    inquirer
      .prompt([
        { 
          type: "input",
          name: "choice",
          message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
          validate: function(answer) {
            return !isNaN(answer) || answer.toLowerCase() === "q";
          }
        }
      ])
      .then(function(answer) {
        checkIfShouldExit(answer.choice);

        let choiceId = parseInt(answer.choice);
        let product = checkInventory(choiceId, inventory);
  
        if (product) {
          promptCustomerForQuantity(product);
        }
        else {
          console.log("\nThat item is not in the inventory.");
          loadProducts();
        }
      });
  }
  
  function promptCustomerForQuantity(product) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "quantity",
          message: "How many would you like? [Quit with Q]",
          validate: function(answer) {
            return answer > 0 || answer.toLowerCase() === "q";
          }
        }
      ])
      .then(function(answer) {
        checkIfShouldExit(answer.quantity);
        let quantity = parseInt(answer.quantity);
  
        if (quantity > product.stock_quantity) {
          console.log("\nInsufficient quantity!");
          loadProducts();
        }
        else {
          makePurchase(product, quantity);
        }
      });
  }
  
  function makePurchase(product, quantity) {
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ?",
      [quantity, product.price * quantity, product.item_id],
      function(err, answer) {
        console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
        loadProducts();
      }
    );
  }
  
  function checkInventory(choiceId, inventory) {
    for (let i = 0; i < inventory.length; i++) {
      if (inventory[i].item_id === choiceId) {
        return inventory[i];
      } 
    }
    return null;
  }

  function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
      console.log("Goodbye!");
      process.exit(0);
    }
  }