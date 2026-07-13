const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());

const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "backend-db",
    user: "postgres",
    password: "postgres"
})

// GET all books
app.get("/books", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books ORDER BY published_year DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error reading books" });
  }
});

// Search books by title
app.get("/books/search", async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const result = await pool.query(
      "SELECT * FROM books WHERE title ILIKE $1",
      [`%${title}%`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No books found matching your search" });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error searching book titles" });
  }
});

// GET book stats
app.get("/books/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE is_available = true) AS available,
      COUNT(*) FILTER (WHERE is_available = false) AS unavailable
      FROM books
    `);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// GET available books
app.get("/books/available", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books WHERE is_available = true ORDER BY published_year DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching available books" });
  }
});

// GET books by genre
app.get("/books/genre/:genre", async (req, res) => {
  try {
    const genre = req.params.genre;
    const books = await pool.query(
      "SELECT * FROM books WHERE genre ILIKE $1 ORDER BY title ASC",
      [`%${genre}%`]
    );

    if (books.rows.length === 0) {
      return res.status(404).json({ message: "Book genre not found" })
    }
    res.json(books.rows)
  } catch (error) {
    res.status(500).json({ message: "Error fetching genre" })
  }
});

// GET /books/available - return only available books sorted by published year descending
app.get("/books/available", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE is_available = true ORDER BY published_year DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET single book
app.get("/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

    if (book.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error reading books" });
  }
});

// POST new book
app.post("/books", async (req, res) => {
  try {
    const { title, author, genre, published_year, is_available } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const result = await pool.query(
      "INSERT INTO books (title, author, genre, published_year, is_available) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, genre, published_year, is_available ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error creating book" });
  }
});

// PUT update book
app.put("/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, author, genre, published_year, is_available } = req.body;

    const result = await pool.query(
      `UPDATE books
       SET title = COALESCE($1, title),
           author = COALESCE($2, author),
           genre = COALESCE($3, genre),
           published_year = COALESCE($4, published_year),
           is_available = COALESCE($5, is_available)
       WHERE id = $6 RETURNING *`,
      [title, author, genre, published_year, is_available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
});

// DELETE book
app.delete("/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted", book: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book" });
  }
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});