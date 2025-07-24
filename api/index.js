const express = require('express');
const app = express();
require('dotenv').config();

const db = require('../models/db');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const bannerRoutes = require('../routes/bannerRoutes');
const serviceRoutes = require('../routes/serviceRoutes');
const topupRoutes = require('../routes/topupRoutes');
const transactionRoutes = require('../routes/transactionRoutes');

app.use(express.json());

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Selamat datang SIMS PPOB API');
});

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/', bannerRoutes);
app.use('/', serviceRoutes);
app.use('/', topupRoutes);
app.use('/', transactionRoutes);

// Export sebagai handler function (Vercel Function)
module.exports = app;
