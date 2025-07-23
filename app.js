// app.js

const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const db = require('./models/db');
const authRoutes = require('./routes/authRoutes');

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cek route awal
app.get('/', (req, res) => {
  res.send('Selamat datang SIMS PPOB API');
});

app.use('/', authRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});