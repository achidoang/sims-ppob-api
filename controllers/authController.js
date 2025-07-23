// controllers/authController.js

const db = require('../models/db');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  // Schema validasi dengan custom messages
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Parameter email tidak sesuai format',
      'any.required': 'Parameter email wajib diisi'
    }),
    first_name: Joi.string().required().messages({
      'any.required': 'Parameter first_name wajib diisi'
    }),
    last_name: Joi.string().required().messages({
      'any.required': 'Parameter last_name wajib diisi'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Parameter password minimal 8 karakter',
      'any.required': 'Parameter password wajib diisi'
    })
  });

  // Validasi input - akan return status 400 jika error
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
    // Cek email unik - akan return status 400 jika email sudah ada
    const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({
        status: 101,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await db.query(
      'INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)',
      [email, first_name, last_name, hashedPassword]
    );

    // Response sukses
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


const loginUser = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
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

    const { email, password } = req.body;

    try {
        // cari user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }

        // cek password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }

        // buat token
        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            {expiresIn: '12h'}
        );

        // response sukses
        return res.status(200).json({
            status: 0,
            message: 'Login sukses',
            data: { token}
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


module.exports = { registerUser, loginUser };