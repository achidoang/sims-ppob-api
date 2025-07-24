// controllers/topupController.js

const db = require('../models/db');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid'); // pastikan sudah install uuid

const topUpBalance = async (req, res) => {
  const schema = Joi.object({
    top_up_amount: Joi.number().min(0).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 102,
      message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      data: null
    });
  }

  const email = req.user.email;
  const { top_up_amount } = req.body;

  try {
    // 1. Dapatkan user_id dari email
    const userResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    const user_id = user.id;

    // 2. Tambah saldo user
    const updateResult = await db.query(
      `UPDATE users
       SET balance = balance + $1
       WHERE id = $2
       RETURNING balance`,
      [top_up_amount, user_id]
    );
    const newBalance = updateResult.rows[0].balance;

    // 3. Simpan transaksi topup
    const invoice_number = 'INV-' + uuidv4().replace(/-/g, '').slice(0, 10); // contoh invoice unik
    await db.query(
      `INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
       VALUES ($1, $2, 'TOPUP', 'Top up saldo', $3)`,
      [user_id, invoice_number, top_up_amount]
    );

    return res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: newBalance
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

module.exports = { topUpBalance };