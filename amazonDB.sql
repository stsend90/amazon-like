DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("Uncharted 4", "Video Games", 49.95, 150),
        ("DOOM", "Video Games", 59.99, 200),
        ("Crate of Spam", "Food and Drink", 24.50, 50),
        ("Cool Shades", "Apparel", 75.00, 5),
        ("Worn Denim Jeans", "Apparel", 54.25, 35),
        ("Survival Towel", "Necessities", 42.42, 42),
        ("Bill and Ted's Excellent Adventure", "Films", 15.00, 25),
        ("Mad Max: Fury Road", "Films", 25.50, 57),
        ("Monopoly", "Board Games", 30.50, 35),
        ("Yahtzee", "Board Games", 19.95, 23);

CREATE TABLE departments (
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(50)NOT NULL,
  over_head_cost DECIMAL(10,2)NOT NUll,
  primary key (department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_cost)
VALUES  ("Video Games", 150),
        ("Apparel", 70),
        ("Board Games", 10),
        ("BluRay films", 200),
        ("Food and beverage", 60)