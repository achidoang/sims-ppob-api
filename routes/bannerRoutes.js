// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const { getAllBanners } = require('../controllers/bannerController');

router.get('/banner', getAllBanners);

module.exports = router;