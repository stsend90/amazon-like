# Bamazon

Created during UCF's Full stack Bootcamp 2019. The goal was to create an Amazon-like store front using Node.js and a MySQL database.

### What Each Does

1. `AmazonCustomer.js`

    * Prints the products in the store.

    * Prompts customer which product they would like to purchase by ID number.

    * Asks for the quantity.

      * If there is a sufficient amount of the product in stock, it will return the total for that purchase.
      * However, if there is not enough of the product in stock, it will tell the user that there isn't enough of the product.
      * If the purchase goes through, it updates the stock quantity to reflect the purchase.
      * It will also update the product sales in the department MySQL database table.

-----------------------

2. `AmazonManager.js`

    * Starts with a menu:
        * View Products for Sale
        * View Low Inventory
        * Add to Inventory
        * Add New Product
        * End Session

    * If the manager selects `View Products for Sale`, it lists all of the products in the store including all of their details.

    * If the manager selects `View Low Inventory`, it'll list all the products with less than five items in its StockQuantity column.

    * If the manager selects `Add to Inventory`, it allows the manager to select a product and add inventory.

    * If the manager selects `Add New Product`, it allows the manager to add a new product to the store.

    * If the manager selects `Exit`, it ends the session and doesn't go back to the menu.

-----------------------
## Results
-  ![AmazonCustomer/Challange1](images/challange1.png)

-----------------------

-  ![AmazonCustomer/Challange2p1](images/challange2p1.png)

-----------------------

-  ![AmazonCustomer/Challange2p2](images/challange2p2.png)

-----------------------

## Working progress
-  ![AmazonCustomer/Challange1](images/challange3.png)

-----------------------

## Technologies used
- Node.js
- Inquire NPM Package (https://www.npmjs.com/package/inquirer)
- MYSQL NPM Package (https://www.npmjs.com/package/mysql)
- Console.table NPM Package

-----------------------

### Prerequisites

```
- Node.js - Download the latest version of Node https://nodejs.org/en/
- Create a MYSQL database called 'Bamazon', reference schema.sql
```

## Built With

* Visual Studio Code - Text Editor
* MySQL/MySQLWorkbench
* Terminal/Gitbash

-----------------------

## Authors

**Jay Saran** - *JS/MySQL/Node.js* - [Jay Saran](https://github.com/stsend90)