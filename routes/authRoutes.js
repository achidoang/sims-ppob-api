// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

router.post('/registration', registerUser);
module.exports = router;

