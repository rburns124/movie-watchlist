const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all movies
router.get('/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a movie
router.post('/movies', (req, res) => {
  const { title, poster_url } = req.body;
  db.query(
    'INSERT INTO movies (title, poster_url) VALUES (?, ?)',
    [title, poster_url],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId });
    }
  );
});

// Toggle watched
router.put('/movies/:id', (req, res) => {
  db.query('UPDATE movies SET watched = NOT watched WHERE id = ?', [req.params.id], err => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// Delete movie
router.delete('/movies/:id', (req, res) => {
  db.query('DELETE FROM movies WHERE id = ?', [req.params.id], err => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

module.exports = router; // ← THIS LINE IS CRUCIAL
