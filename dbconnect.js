import { Pool } from "pg";

const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "backend-db",
    user: "postgres",
    password: "postgres"
})

const result = await pool.query("SELECT * FROM books");
console.log(result.rows);   