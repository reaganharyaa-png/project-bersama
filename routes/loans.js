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

router.post('/', async (req, res) => {
  try {
    const equipmentId = req.body.equipment_id;
    let borrowerName = req.body.borrower_name;

    if (typeof borrowerName !== 'string') {
      return res.status(400).json({ message: 'Nama peminjam wajib diisi' });
    }
    borrowerName = borrowerName.trim();

    if (borrowerName.length < 2 || borrowerName.length > 80) {
      return res.status(400).json({ message: 'Nama harus 2 sampai 80 karakter' });
    }
    if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
      return res.status(400).json({ message: 'ID alat tidak valid' });
    }

    const [equipment] = await db.query(
      'SELECT * FROM equipment WHERE id = ?',
      [equipmentId]
    );
    if (equipment.length === 0) {
      return res.status(404).json({ message: 'Alat tidak ditemukan' });
    }

    if (equipment[0].status === 'borrowed') {
      return res.status(409).json({ message: 'Alat sedang dipinjam' });
    }

    const [result] = await db.query(
      'INSERT INTO loans (equipment_id, borrower_name, borrowed_at) VALUES (?, ?, NOW())',
      [equipmentId, borrowerName]
    );

    await db.query(
      "UPDATE equipment SET status = 'borrowed' WHERE id = ?",
      [equipmentId]
    );

    res.status(201).json({ message: 'Berhasil dipinjam', id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gangguan server' });
  }
});

router.patch('/:id/return', async (req, res) => {
  try {
    const loanId = Number(req.params.id);

    if (!Number.isInteger(loanId) || loanId <= 0) {
      return res.status(400).json({ message: 'ID peminjaman tidak valid' });
    }

    const [loans] = await db.query(
      'SELECT * FROM loans WHERE id = ?',
      [loanId]
    );
    if (loans.length === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    if (loans[0].returned_at !== null) {
      return res.status(409).json({ message: 'Alat sudah dikembalikan' });
    }

    await db.query(
      'UPDATE loans SET returned_at = NOW() WHERE id = ?',
      [loanId]
    );

    await db.query(
      "UPDATE equipment SET status = 'available' WHERE id = ?",
      [loans[0].equipment_id]
    );

    res.status(200).json({ message: 'Berhasil dikembalikan' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gangguan server' });
  }
});

module.exports = router;
