// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'Token tidak ditemukan',
            data: null
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: 'Token tidak valid',
                data: null
            });
        }
        req.user = payload; // simpan email user
        next();
    });
};

module.exports = authenticateToken;