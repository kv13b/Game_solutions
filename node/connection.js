const mysql2 = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

const checkconnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("connected");
    connection.release();
  } catch (error) {
    console.log("error" + error);
  }
};

module.exports = { pool, checkconnection };
