const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config(); // Make sure this is at the top if using .env

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// ✅ Use environment variable or fallback to 5000
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
