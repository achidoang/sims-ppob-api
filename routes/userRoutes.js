// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware');
const { updateProfileImage } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const { getBalance } = require('../controllers/userController');


router.put('/profile/update', authenticateToken, updateProfile);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile/image', authenticateToken, upload.single('file'), updateProfileImage);
router.get('/balance', authenticateToken, getBalance);

module.exports = router;