const db = require('../db');

exports.create = (req, res) => {
  const { title, amount, date, category, type } = req.body;
  const sql = `INSERT INTO transactions (title, amount, date, category, type) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [title, amount, date, category, type], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
};

exports.getAll = (req, res) => {
  const sql = `SELECT * FROM transactions ORDER BY date DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, amount, date, category, type } = req.body;

  const sql = `UPDATE transactions SET title = ?, amount = ?, date = ?, category = ?, type = ? WHERE id = ?`;

  db.run(sql, [title, amount, date, category, type, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ updated: this.changes });
  });
};

exports.remove = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM transactions WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ deleted: this.changes });
  });
};
