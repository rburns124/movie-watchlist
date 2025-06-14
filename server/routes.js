const express = require('express');
const router = express.Router();
const db = require('./db'); // shared database pool

// Return every movie in the list
router.get('/movies', (req, res) => {
  db.query('SELECT * FROM movies')
    .then(result => res.json(result.rows))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Save a new movie
router.post('/movies', (req, res) => {
  const { title, poster_url } = req.body;
  db.query(
    'INSERT INTO movies (title, poster_url) VALUES ($1, $2) RETURNING id',
    [title, poster_url]
  )
    .then(result => res.json({ id: result.rows[0].id }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Flip the watched flag
router.put('/movies/:id', (req, res) => {
  db.query(
    'UPDATE movies SET watched = NOT watched WHERE id = $1',
    [req.params.id]
  )
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Remove a movie entirely
router.delete('/movies/:id', (req, res) => {
  db.query(
    'DELETE FROM movies WHERE id = $1',
    [req.params.id]
  )
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
