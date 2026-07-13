-- inner join
SELECT *
FROM customers c
JOIN orders o
  ON c.id = o.customer_id;

-- left join
SELECT *
FROM customers c
LEFT JOIN orders o
  ON c.id = o.customer_id;

-- right join
SELECT *
FROM products p
RIGHT JOIN categories c
  ON p.category_id = c.id;

  -- full outer join
SELECT *
FROM products p
FULL OUTER JOIN order_items oi
  ON p.id = oi.product_id;

-- self join
SELECT *    
from customers c
join orders o
  on c.id = o.customer_id
join order_items oi
  on o.id = oi.order_id;ED








  -- 1. Every customer + order count (including zero)
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o
  ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY order_count DESC;

-- 2. Every category + product count (including zero)
SELECT cat.name, COUNT(p.id) AS product_count
FROM categories cat
LEFT JOIN products p
  ON cat.id = p.category_id
GROUP BY cat.id, cat.name
ORDER BY product_count DESC;

-- 3. Products never ordered
SELECT p.name, p.price
FROM products p
LEFT JOIN order_items oi
  ON p.id = oi.product_id
WHERE oi.id IS NULL;

-- 4. Customers who never ordered
SELECT c.name, c.email
FROM customers c
LEFT JOIN orders o
  ON c.id = o.customer_id
WHERE o.id IS NULL;