const db = require('../db');

exports.create = (req, res) => {
  const { title, date, description, location } = req.body;

  const sql = `INSERT INTO events (title, date, description, location) VALUES (?, ?, ?, ?)`;
  db.run(sql, [title, date, description, location], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
};

exports.getAll = (req, res) => {
  const sql = `SELECT * FROM events ORDER BY date DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, date, description, location } = req.body;

  const sql = `UPDATE events SET title = ?, date = ?, description = ?, location = ? WHERE id = ?`;
  db.run(sql, [title, date, description, location, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ updated: this.changes });
  });
};

exports.remove = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM events WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ deleted: this.changes });
  });
};
