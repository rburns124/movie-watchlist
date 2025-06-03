const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'movie_watchlist'
});

db.connect(err => {
  if (err) {
    console.error('❌ Failed to connect to MySQL:', err);
  } else {
    console.log('✅ MySQL Connected');
  }
});

module.exports = db;
