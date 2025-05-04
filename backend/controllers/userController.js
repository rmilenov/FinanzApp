const db = require('../db');

exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT u.id, u.username, u.email, u.created_at, r.name AS role
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    ORDER BY u.created_at ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getRoles = (req, res) => {
  db.all(`SELECT id, name FROM roles`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.assignOrUpdateRole = (req, res) => {
  const { userId, roleId } = req.body;

  if (!userId || !roleId) {
    return res.status(400).json({ error: 'userId und roleId erforderlich' });
  }

  // Master darf nicht verändert werden
  if (roleId !== 1) {
    db.get(
      `SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ?`,
      [userId],
      (err, row) => {
        if (row && row.name === 'master') {
          return res.status(403).json({
            error: 'Die Rolle des Master-Accounts kann nicht geändert werden.',
          });
        }

        const checkSql = `SELECT id FROM user_roles WHERE user_id = ?`;
        db.get(checkSql, [userId], (err, row) => {
          if (err) return res.status(500).json({ error: err.message });

          if (row) {
            const updateSql = `UPDATE user_roles SET role_id = ? WHERE user_id = ?`;
            db.run(updateSql, [roleId, userId], function (err) {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ updated: true });
            });
          } else {
            const insertSql = `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`;
            db.run(insertSql, [userId, roleId], function (err) {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ assigned: true });
            });
          }
        });
      }
    );
  } else {
    res.status(403).json({ error: 'Master-Rolle darf nicht zugewiesen werden.' });
  }
};
