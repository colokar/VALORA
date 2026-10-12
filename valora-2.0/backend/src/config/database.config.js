import pool from "../database/connection.js";

export const connectDB = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL conectado");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("❌ Error de conexión");
    console.error(error.message);
    process.exit(1);
  }
};