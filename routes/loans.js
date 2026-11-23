const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT loans.id,
             loans.equipment_id,
             equipment.name AS equipment_name,
             loans.borrower_name,
             loans.borrowed_at,
             loans.returned_at,
             IF(loans.returned_at IS NULL, 'dipinjam', 'dikembalikan') AS status
      FROM loans
      JOIN equipment ON equipment.id = loans.equipment_id
      ORDER BY loans.id DESC
    `);

    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gangguan server' });
  }
});

// endpoint ditaruh di sini

module.exports = router;
