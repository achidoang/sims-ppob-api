// routes/topupRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { topUpBalance } = require('../controllers/topupController');

router.post('/topup', authenticateToken, topUpBalance);

module.exports = router;