// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');

router.post('/login', loginUser);

router.post('/registration', registerUser);
module.exports = router;

