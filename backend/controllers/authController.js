const db = require('../db');
const bcrypt = require('bcrypt');
const { use } = require('bcrypt/promises');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
const REGISTRATION_KEY = process.env.REGISTRATION_KEY;


exports.register = async (req, res) => {
  const { username, password, email, accessKey } = req.body;

  if (accessKey !== REGISTRATION_KEY) {
    return res.status(403).json({ error: 'Ungültiger Registrierungsschlüssel' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const stmt = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;

  db.run(stmt, [username, hashedPassword, email], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Benutzername oder E-Mail bereits vergeben' });
    }
    res.status(201).json({ id: this.lastID });
  });
};

exports.login = (req, res) => {
    //console.log(req);
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, username], async (err, user) => {
    console.log(err ? err: user);
    if (err || !user) {
      return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
    }
    console.log('Passwort vom Client:', password);
    console.log('Gespeicherter Hash:', user.password);


    const match = await bcrypt.compare(password, user.password);
    console.log('Vergleichsergebnis:', match);
    if (!match) {
      return res.status(401).json({ error: 'Falsches Passwort' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '2h',
    });

    res.json({ token, user: { id: user.id, username: user.username } });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.get(`SELECT id, username, email, created_at FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

    const sql = `
      SELECT area, can_read, can_write
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      WHERE ur.user_id = ?
    `;

    db.all(sql, [userId], (err, permissions) => {
      if (err) return res.status(500).json({ error: 'Fehler beim Laden der Berechtigungen' });

      const rights = {};
      permissions.forEach((p) => {
        rights[p.area] = { read: !!p.can_read, write: !!p.can_write };
      });

      res.json({ ...user, rights });
    });
  });
};
