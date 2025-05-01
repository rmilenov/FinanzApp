const db = require('../db');

function checkRolePermission(area, required = 'read') {
  return (req, res, next) => {
    const userId = req.user.id;
    const sql = `
      SELECT rp.can_read, rp.can_write
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      WHERE ur.user_id = ? AND rp.area = ?
    `;
    db.get(sql, [userId, area], (err, row) => {
      if (err) return res.status(500).json({ error: 'Fehler bei Rechteprüfung' });
      if (!row) return res.status(403).json({ error: 'Keine Rolle zugewiesen' });

      if (required === 'read' && row.can_read) return next();
      if (required === 'write' && row.can_write) return next();

      return res.status(403).json({ error: 'Keine Berechtigung für diesen Bereich' });
    });
  };
}

module.exports = checkRolePermission;
