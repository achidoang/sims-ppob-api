// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { doTransaction } = require('../controllers/transactionController');
const { getTransactionHistory } = require('../controllers/transactionController');

router.post('/transaction', authenticateToken, doTransaction);
router.get('/transaction/history', authenticateToken, getTransactionHistory);


module.exports = router;
