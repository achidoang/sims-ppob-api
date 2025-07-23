// controllers/serviceController.js

const db = require('../models/db');

const getAllServices = async (req, res) => {
  try {
    // Pastikan token valid sebelum mengakses data
    if (!req.user) {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak tidak valid atau kadaluwarsa',
        data: null
      });
    }

    const result = await db.query(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id ASC'
    );

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
};

module.exports = { getAllServices };