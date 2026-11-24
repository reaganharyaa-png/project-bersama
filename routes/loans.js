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
  const body = req.body || {};
  const equipmentId = Number(body.equipment_id);
  const borrowerName = body.borrower_name;

  if (typeof borrowerName !== 'string') {
    return res.status(400).json({ message: 'Nama peminjam wajib diisi' });
  }
  const namaBersih = borrowerName.trim();
  if (namaBersih.length < 2 || namaBersih.length > 80) {
    return res.status(400).json({ message: 'Nama harus 2 sampai 80 karakter' });
  }

  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    return res.status(400).json({ message: 'ID alat tidak valid' });
  }

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [alat] = await conn.query(
      'SELECT id, status FROM equipment WHERE id = ? FOR UPDATE',
      [equipmentId]
    );

    if (alat.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Alat tidak ditemukan' });
    }

    if (alat[0].status === 'borrowed') {
      await conn.rollback();
      return res.status(409).json({ message: 'Alat sedang dipinjam' });
    }

    const [hasil] = await conn.query(
      'INSERT INTO loans (equipment_id, borrower_name, borrowed_at) VALUES (?, ?, NOW())',
      [equipmentId, namaBersih]
    );

    await conn.query(
      "UPDATE equipment SET status = 'borrowed' WHERE id = ?",
      [equipmentId]
    );

    await conn.commit();
    res.status(201).json({ message: 'Berhasil dipinjam', id: hasil.insertId });
  } catch (err) {
    if (conn) await conn.rollback();
    console.log(err);
    res.status(500).json({ message: 'Gangguan server' });
  } finally {
    if (conn) conn.release();
  }
});

router.patch('/:id/return', async (req, res) => {
  const loanId = Number(req.params.id);
  if (!Number.isInteger(loanId) || loanId <= 0) {
    return res.status(400).json({ message: 'ID peminjaman tidak valid' });
  }

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [pinjaman] = await conn.query(
      'SELECT id, equipment_id, returned_at FROM loans WHERE id = ? FOR UPDATE',
      [loanId]
    );

    if (pinjaman.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    if (pinjaman[0].returned_at !== null) {
      await conn.rollback();
      return res.status(409).json({ message: 'Alat sudah dikembalikan' });
    }

    await conn.query(
      'UPDATE loans SET returned_at = NOW() WHERE id = ?',
      [loanId]
    );

    await conn.query(
      "UPDATE equipment SET status = 'available' WHERE id = ?",
      [pinjaman[0].equipment_id]
    );

    await conn.commit();
    res.status(200).json({ message: 'Berhasil dikembalikan' });
  } catch (err) {
    if (conn) await conn.rollback();
    console.log(err);
    res.status(500).json({ message: 'Gangguan server' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;