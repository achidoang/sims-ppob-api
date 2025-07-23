// app.js

const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const db = require('./models/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

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

app.use('/', authRoutes); // Tambahkan route auth
app.use('/', userRoutes); // Tambahkan route user
app.use('/uploads', express.static('uploads')); // Untuk mengakses file upload
app.use('/', bannerRoutes); // Tambahkan route banner
app.use('/', serviceRoutes); // Tambahkan route service



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});