import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Verificamos si estamos en Render (o producción) o en local
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction
          ? { rejectUnauthorized: false }
          : false,
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
);

export default pool;
