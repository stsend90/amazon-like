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
  console.log("\n==============================\n")
  console.log("\nConnected as id: " + connection.threadId + "\n");
  console.log("\n==============================\n")
  runProducts();     

});

function runProducts() {
  connection.query("SELECT * FROM products", function (err, answer) {
    if (err) throw err;
    console.table(answer);
    customerItem(answer);
  });
};

function customerItem(inventory) {
  inquirer.prompt([{
        type: "Input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? [Exit with Q]",
        validate: function (answer) {
          return !isNaN(answer) || answer.toLowerCase() === "q";
        }
      }
  ]).then(function (answer) {
      exitOption(answer.choice);

      const choiceId = parseInt(answer.choice);
      const product = checkInventory(choiceId, inventory);

      if (product) {
        customerQuantity(product);
      }
      else {
        console.log("\n==============================\n")
        console.log("\nThat item is not in the inventory.");
        console.log("\n==============================\n")
        runProducts();
      }
    });
};

function customerQuantity(product) {
  inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase? [Exit with Q]",
        validate: function (answer) {
          return answer > 0 || answer.toLowerCase() === "q";
        }
      }
  ]).then(function (answer) {
      exitOption(answer.quantity);
      let quantity = parseInt(answer.quantity);

      if (quantity > product.stock_quantity) {
        console.log("\n==============================\n")
        console.log("\nInsufficient quantity!\n");
        console.log("\n==============================\n")
        runProducts();
      }
      else {
        makePurchase(product, quantity);
      }
    });
};

function makePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ?",
    [quantity, product.price * quantity, product.item_id],
    function (err, answer) {
      console.log("\n==============================\n")
      console.log(`\nSuccessfully purchased ${quantity} ${product.product_name} your total: $${parseInt(quantity) * parseInt(product.price)}\n`);
      console.log("\n==============================\n")
      runProducts();
    }
  );
};

function checkInventory(choiceId, inventory) {
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
};

function exitOption(choice) {
  if (choice.toLowerCase() === "q") {
    console.log("\n==============================\n");
    console.log("Thank you for shopping with us! I hope to see you soon!")
    console.log("\n==============================\n");
    process.exit(0);
  };
};