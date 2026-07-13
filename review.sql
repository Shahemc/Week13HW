CREATE TABLE books (
  id SERIAL PRIMARY KEY,      -- auto incrementing unique ID
  title TEXT NOT NULL,        -- required string
  author TEXT NOT NULL,       -- required string
  genre TEXT,                 -- optional string
  published_year INT,         -- optional number
  is_available BOOLEAN DEFAULT true,  -- defaults to true if not provided
  created_at TIMESTAMP DEFAULT NOW()  -- automatically set to current time
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  friendsList TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false
);

-- Get every single item in the books table
SELECT * FROM books;

-- Get a single item from the books table
SELECT * FROM books WHERE id = 1;

--Insert a new book into the books table
INSERT INTO books (title, author) VALUES ('Dune', 'Frank Herbert') RETURNING *;

-- Update an item in the books table
UPDATE books SET is_available = false WHERE id = 1 RETURNING *;

-- Delete an item from the books table
DELETE FROM books WHERE id = 1 RETURNING *;