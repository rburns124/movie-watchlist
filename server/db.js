const { Pool } = require('pg');
require('dotenv').config();

// Connection details come from environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    // Render uses self-signed certificates
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ Failed to connect to PostgreSQL:', err));

module.exports = pool;
