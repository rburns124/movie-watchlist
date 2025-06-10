const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432, // Default PostgreSQL port
  ssl: process.env.DB_SSL === 'true' // optional
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch((err) => console.error('❌ Failed to connect to PostgreSQL:', err));

module.exports = pool;
