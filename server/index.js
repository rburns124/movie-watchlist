const express = require('express');
const cors = require('cors');
const routes = require('./routes');
// Load variables from .env so the configuration stays out of the code
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Use the PORT environment variable when available
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
