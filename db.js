const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'online_donation',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'online_donation');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
  }
})();

module.exports = pool;
