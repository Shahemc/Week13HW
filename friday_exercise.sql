-- JOIN: combines horizontally (adds columns)
SELECT e.name, e.salary, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.id;
-- Result: one row per match, columns from BOTH tables

-- UNION: combines vertically (adds rows), removes exact duplicates
SELECT name, city FROM customers_2025
UNION
SELECT name, city FROM customers_2026;
-- If 'Alice, NYC' is in both tables, appears ONCE

-- UNION ALL: keeps everything, including duplicates
SELECT name, city FROM customers_2025
UNION ALL
SELECT name, city FROM customers_2026;
-- If 'Alice, NYC' is in both tables, appears TWICE (faster too — no dedup step)


-- 1. Get a combined unique list of all product names-- across both current and old products
SELECT name FROM products
UNION  
SELECT name FROM old_products;      
-- 2. Get a combined list including duplicates-- and add a column that labels which table each row came from
SELECT name, 'current' AS source FROM products
UNION ALL
SELECT name, 'old' AS source FROM old_products;   
-- 3. How many total unique product names exist across both tables? (Hint: wrap a UNION in a subquery and COUNT)
SELECT COUNT(*) AS unique_products
FROM (
  SELECT name FROM products
  UNION
  SELECT name FROM old_products
) AS combined;



-- 1. Every order with customer name, status, total value
SELECT o.id, c.name, o.status,
       SUM(oi.unit_price * oi.quantity) AS total_value
FROM orders o
JOIN customers c
  ON o.customer_id = c.id
JOIN order_items oi
  ON o.id = oi.order_id
GROUP BY o.id, c.name, o.status
ORDER BY total_value DESC;

-- 2. Products with category name and price, in stock only
SELECT p.name, c.name AS category, p.price
FROM products p
JOIN categories c
  ON p.category_id = c.id
WHERE p.stock_quantity > 0
ORDER BY c.name, p.price;

-- 3. Customers with at least one delivered order, no duplicates
SELECT DISTINCT c.name, c.email
FROM customers c
JOIN orders o
  ON c.id = o.customer_id
WHERE o.status = 'delivered';

-- 4. Total spent per customer, only if over $100
SELECT c.name, c.email,
       SUM(oi.unit_price * oi.quantity) AS total_spent
FROM customers c
JOIN orders o
  ON c.id = o.customer_id
JOIN order_items oi
  ON o.id = oi.order_id
GROUP BY c.id, c.name, c.email
HAVING SUM(oi.unit_price * oi.quantity) > 100
ORDER BY total_spent DESC;

-- 5. UNION with Expensive/Affordable labels
SELECT name, price, 'Expensive' AS label\q

FROM products
WHERE price > 100
UNION
SELECT name, price, 'Affordable' AS label
FROM products
WHERE price <= 100
ORDER BY price DESC;