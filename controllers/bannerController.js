// controllers/bannerController.js
const db = require('../models/db');
const getAllBanners = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM banners ORDER BY id ASC');

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Server error',
            data: null
        });
    }
}

module.exports = {
    getAllBanners 
};