-- 1. List all products that are low stock (under 30 units)
--    ordered by stock quantity ascending
SELECT * FROM products WHERE stock_quantity < 30 ORDER BY stock_quantity ASC;

-- 2. What is the total value of all inventory?
--    (Hint: price * stock_quantity for each product, then sum it all)
SELECT SUM(price * stock_quantity) AS total_value FROM products;

-- 3. How many orders are in each status?
--    Show status and count, ordered by count descending
SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status ORDER BY order_count DESC;

-- 4. What is the most expensive product in the entire catalog?
--    Show only that one product
SELECT * FROM products WHERE price = (SELECT MAX(price) FROM products);

SELECT * FROM products ORDER BY price DESC LIMIT 1;

-- 5. What is the average price of products grouped by category_id?
--    Only show categories where the average price is above $50
SELECT category_id, AVG(price) AS average_price FROM products GROUP BY category_id HAVING AVG(price) > 50;

SELECT AVG(price) AS average_price FROM products GROUP BY category_id HAVING AVG(price) > 50;

-- 6. Label every order as 'Recent' if placed in 2025,
--    or 'Old' if placed before 2025. Show order id, customer_id,
--    order_date, and the label
SELECT order_id, customer_id, order_date,   CASE WHEN YEAR(order_date) = 2025 THEN 'Recent' ELSE 'Old' END AS order_label
FROM orders;    
-- 7. How many products are in each price tier?
--    Budget (under $30), Mid Range ($30–$100), Premium (over $100)
--    Show the tier name and count  
SELECT 
    CASE 
        WHEN price < 30 THEN 'Budget' 
        WHEN price BETWEEN 30 AND 100 THEN 'Mid Range' 
        ELSE 'Premium' 
    END AS price_tier, 
    COUNT(*) AS product_count

    SELECT CASE WHEN price < 30 THEN 'Budget' WHEN price <= 100 THEN 'Mid Range' ELSE 'Premium' END AS price_tier, COUNT(*) AS product_count FROM products GROUP BY price_tier;


-- 1. List all orders placed in 2025, ordered by order_date descending
SELECT * FROM orders WHERE YEAR(order_date) = 2025 ORDER BY order_date DESC;

-- 2. What is the total revenue across all order items?
--    (Hint: unit_price * quantity for each item, then sum)
SELECT SUM(unit_price * quantity) AS total_revenue FROM order_items;

-- 3. Which single order item had the highest total value?
--    (unit_price * quantity — show order_id, product_id, and the total)
SELECT order_id, product_id, (unit_price * quantity) AS total_value
FROM order_items
ORDER BY total_value DESC
LIMIT 1;

-- 4. How many items were ordered in each order?
--    Show order_id and total quantity, ordered by total quantity descending
SELECT order_id, SUM(quantity) AS total_quantity
FROM order_items
GROUP BY order_id
ORDER BY total_quantity DESC;

-- 5. What is the average unit price of items sold across all orders?
--    Round to 2 decimal places
select ROUND(AVG(unit_price), 2) AS average_unit_price FROM order_items;
-- 6. How many orders does each customer_id have?
--    Only show customers who have placed more than 1 order
SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) > 1;
-- 7. Label each order as 'High Value' if the total items in that order
--    exceed 3 quantity, or 'Standard' if not.
--    Show order_id and the label
--    (Hint: GROUP BY order_id and use HAVING or CASE with SUM)
SELECT order_id, CASE WHEN SUM(quantity) > 3 THEN 'High Value' ELSE 'Standard' END AS order_label
FROM order_items        