// controllers/transactionController.js

const db = require('../models/db');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const doTransaction = async (req, res) => {
  const schema = Joi.object({
    service_code: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 102,
      message: 'Service code wajib diisi',
      data: null
    });
  }

  const email = req.user.email;
  const { service_code } = req.body;

  try {
    // 1. Get user data
    const userResult = await db.query('SELECT id, balance FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    const user_id = user.id;

    // 2. Get service data
    const serviceResult = await db.query(
      'SELECT service_name, service_tariff FROM services WHERE service_code = $1',
      [service_code]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
      });
    }

    const service = serviceResult.rows[0];

    // 3. Cek saldo cukup
    if (user.balance < service.service_tariff) {
      return res.status(400).json({
        status: 104,
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    // 4. Kurangi saldo user
    await db.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [service.service_tariff, user_id]
    );

    // 5. Simpan transaksi
    const invoice_number = 'INV-' + uuidv4().replace(/-/g, '').slice(0, 12);
    const created_on = new Date();

    await db.query(
      `INSERT INTO transactions (user_id, invoice_number, transaction_type, description, service_code, total_amount, created_on)
       VALUES ($1, $2, 'PAYMENT', $3, $4, $5, $6)`,
      [user_id, invoice_number, service.service_name, service_code, service.service_tariff, created_on]
    );

    return res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number,
        service_code,
        service_name: service.service_name,
        transaction_type: 'PAYMENT',
        total_amount: service.service_tariff,
        created_on
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

const getTransactionHistory = async (req, res) => {
  const email = req.user.email;
  const offset = parseInt(req.query.offset) || 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  try {
    // Dapatkan user_id
    const userResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    const user_id = user.id;

    // Query riwayat transaksi
    let query = `
      SELECT invoice_number, transaction_type, description, total_amount, created_on
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_on DESC
      OFFSET $2
    `;

    let params = [user_id, offset];

    if (limit !== null) {
      query += ` LIMIT $3`;
      params.push(limit);
    }

    const result = await db.query(query, params);

    return res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset,
        limit: limit || result.rows.length,
        records: result.rows
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

module.exports = {
  doTransaction,
  getTransactionHistory
};

