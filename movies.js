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
app.get("/genres", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM genres ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error reading genres" });
  }
});

app.get("/directors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM directors ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error reading directors" });
  }
});

app.get("/movies/all", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         movies.id,
         movies.title,
         directors.name AS director,
         genres.name AS genre,
         movies.release_year,
         movies.is_watched
       FROM movies
       JOIN directors ON movies.director_id = directors.id
       JOIN genres ON movies.genre_id = genres.id
       ORDER BY movies.release_year DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error reading movies" });
  }
});

// GET all movies 
app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM movies ORDER BY release_year DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error reading movies" });
  }
});

app.get("/movies/search", async (req, res) => {
  try {
    const { title, genre } = req.query;

    if (!title && !genre) {
      return res.status(400).json({ message: "Title or genre is required" });
    }

    const result = await pool.query(
      `SELECT
         m.id,
         m.title,
         d.name AS director,
         g.name AS genre,
         m.release_year,
         m.is_watched
       FROM movies m
       JOIN directors d ON m.director_id = d.id
       JOIN genres g ON m.genre_id = g.id
       WHERE m.title ILIKE $1 OR g.name ILIKE $2
       ORDER BY m.release_year DESC`,
      [`%${title || "\u0000"}%`, `%${genre || "\u0000"}%`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No movies found matching your search",
      });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error searching movies" });
  }
});
app.listen(3001, () => {
  console.log("server is running on port 3001");
});