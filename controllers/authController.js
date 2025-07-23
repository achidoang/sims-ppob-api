// controllers/authController.js

const db = require('../models/db');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const registerUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().min(8).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 102,
      message: error.details[0].message,
      data: null
    });
  }

  const { email, first_name, last_name, password } = req.body;

  try {
    // cek email unik
    const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({
        status: 101,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan ke database
    await db.query(
      'INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)',
      [email, first_name, last_name, hashedPassword]
    );

    return res.status(200).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null
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

module.exports = { registerUser };
