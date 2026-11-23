const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, category, status FROM equipment ORDER BY id'
    );
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gangguan server' });
  }
});

module.exports = router;