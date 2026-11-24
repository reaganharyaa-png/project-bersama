require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/loans', require('./routes/loans'));

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PinjamLab jalan di http://localhost:${PORT}`));