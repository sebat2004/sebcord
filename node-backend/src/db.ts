import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT!, 10) || 5432,
  idleTimeoutMillis: 30000,
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Database connection error", err);
});

pool.on("remove", () => {
  console.log("Database connection removed");
});

pool.on("acquire", (client) => {
  console.log("Database connection acquired");
});

export default pool;
