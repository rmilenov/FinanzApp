const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const db = new sqlite3.Database('./data.db');
const cors = require('cors'); // Füge dies hinzu

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    category TEXT,
    type TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    location TEXT
  )`);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);
});
app.use(cors({
  origin: 'http://localhost:3000', // oder '*' für alles, aber unsicherer
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// API-Endpunkt, um Transaktionen zu speichern
app.post('/api/transactions', (req, res) => {
  const { title, amount, date, category, type } = req.body;
  const sql = `INSERT INTO transactions (title, amount, date, category, type) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [title, amount, date, category, type], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id: this.lastID });
  });
});

// API-Endpunkt, um Transaktionen abzurufen
app.get('/api/transactions', (req, res) => {
  const sql = 'SELECT * FROM transactions ORDER BY date DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Fehler beim Abrufen der Transaktionen:', err); // <- Logging!
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// API-Endpunkt, um eine Transaktion zu aktualisieren
app.put('/api/transactions/:id', (req, res) => {
  const { title, amount, date, category, type } = req.body;
  const { id } = req.params;
  const sql = `UPDATE transactions SET title = ?, amount = ?, date = ?, category = ?, type = ? WHERE id = ?`;
  db.run(sql, [title, amount, date, category, type, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ updated: this.changes });
  });
});

// API-Endpunkt, um eine Transaktion zu löschen
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM transactions WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ deleted: this.changes });
  });
});

// API-Endpunkt, um Events zu speichern
app.post('/api/events', (req, res) => {
  const { title, date, description, location } = req.body;
  const sql = `INSERT INTO events (title, date, description, location) VALUES (?, ?, ?, ?)`;
  db.run(sql, [title, date, description, location], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id: this.lastID });
  });
});

// API-Endpunkt, um Events abzurufen
app.get('/api/events', (req, res) => {
  const sql = 'SELECT * FROM events ORDER BY date DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Starten des Servers
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
