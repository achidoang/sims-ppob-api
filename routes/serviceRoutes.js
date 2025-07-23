// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const { getAllServices } = require('../controllers/serviceController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/services', authenticateToken, getAllServices);

module.exports = router;

