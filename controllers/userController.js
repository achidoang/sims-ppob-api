// controllers/userController.js

const db = require('../models/db');
const Joi = require('joi');

const getProfile = async (req, res) => {
    try {
        const email = req.user.email; // Ambil email dari token yang sudah di-decode

        const result = await db.query(
            'SELECT id, email, first_name, last_name, profile_image, balance FROM users WHERE email = $1', 
            [email]
        );

    const user = result.rows[0];

    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: user
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

const updateProfile = async (req, res) => {
    // Validasi input
    const schema = Joi.object({
        first_name: Joi.string().required().messages({
            'any.required': 'Parameter first_name wajib diisi',
            'string.empty': 'Parameter first_name tidak boleh kosong'
        }),
        last_name: Joi.string().required().messages({
            'any.required': 'Parameter last_name wajib diisi', 
            'string.empty': 'Parameter last_name tidak boleh kosong'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 102,
            message: error.details[0].message,
            data: null
        });
    }

    // Cek apakah user ada (dari middleware auth)
    if (!req.user || !req.user.email) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        });
    }

    const email = req.user.email;
    const { first_name, last_name } = req.body;

    try {
        // Update profile user
        await db.query(
            'UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3',
            [first_name, last_name, email]
        );

        // Ambil data user yang sudah di-update untuk response
        const userResult = await db.query(
            'SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        }

        const userData = userResult.rows[0];

        // Response sukses dengan data user
        return res.status(200).json({
            status: 0,
            message: 'Update Pofile berhasil',
            data: {
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                profile_image: userData.profile_image || `https://yoururlapi.com/profile.jpeg`
            }
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

const updateProfileImage = async (req, res) => {
    // Cek apakah user ada (dari middleware auth)
    if (!req.user || !req.user.email) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak tidak valid atau kadaluwarsa',
            data: null
        });
    }

    const email = req.user.email;

    // Validasi apakah file ada
    if (!req.file) {
        return res.status(400).json({
            status: 102,
            message: 'Format Image tidak sesuai',
            data: null
        });
    }

    // Validasi format file (tambahan validasi)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            status: 102,
            message: 'Format Image tidak sesuai',
            data: null
        });
    }

    const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        // Update profile image di database
        await db.query(
            'UPDATE users SET profile_image = $1 WHERE email = $2',
            [imagePath, email]
        );

        // Ambil data user yang sudah di-update untuk response
        const userResult = await db.query(
            'SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak tidak valid atau kadaluwarsa',
                data: null
            });
        }

        const userData = userResult.rows[0];

        // Response sukses dengan data user
        return res.status(200).json({
            status: 0,
            message: 'Update Profile Image berhasil',
            data: {
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                profile_image: userData.profile_image
            }
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


module.exports = { getProfile, updateProfile, updateProfileImage };