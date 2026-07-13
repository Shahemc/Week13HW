-- 1. List all products that cost more than $50 and still have stock,
--    ordered by price descending
SELECT * FROM products WHERE price > 50 AND stock_quantity > 0 ORDER BY price DESC;

-- 2. How many orders were placed in each status category?
SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;

-- 3. What is the total quantity of items sold across all orders?
SELECT SUM(quantity) FROM order_items;

-- 4. Which products have a stock quantity between 50 and 150?
SELECT name, stock_quantity FROM products WHERE stock_quantity BETWEEN 50 AND 150;

-- 5. What is the most expensive product in each category?
--    (Hint: GROUP BY with MAX)
SELECT category_id, MAX(price) AS most_expensive FROM products GROUP BY category_id;

-- 6. Label every product as 'In Stock', 'Low Stock' (under 30),
--    or 'Out of Stock' (0) using a CASE statement
SELECT name, stock_quantity, CASE WHEN stock_quantity = 0 THEN 'Out of Stock' WHEN stock_quantity < 30 THEN 'Low Stock' ELSE 'In Stock'
END AS stock_status FROM products;

-- 7. How many distinct customers have placed at least one order?
SELECT COUNT(DISTINCT customer_id) AS customer_count FROM orders;






