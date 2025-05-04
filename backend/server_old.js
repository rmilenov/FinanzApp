const express = require("express");
const app = express();
const db = require('./db');
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/verifyToken");
const checkRolePermission = require("./middleware/checkRolePermissions");
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const corsOptions = require('./config/corsOptions');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());



app.use('/api', transactionRoutes);
app.use('/api', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', userRoutes);
// app.use(cors({
//   origin: 'http://localhost:3000',     
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization','Cache-Control'],
                  
// }));
// Preflight-Anfragen erlauben (sehr wichtig für CORS bei Authorization!)
// app.options('*', cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
// }));


// db.serialize(() => {
//   db.run(`CREATE TABLE IF NOT EXISTS transactions (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title TEXT NOT NULL,
//     amount REAL NOT NULL,
//     date TEXT NOT NULL,
//     category TEXT,
//     type TEXT NOT NULL
//   )`);

//   db.run(`CREATE TABLE IF NOT EXISTS events (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title TEXT NOT NULL,
//     date TEXT NOT NULL,
//     description TEXT,
//     location TEXT
//   )`);

//   db.run(
//     `
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT UNIQUE NOT NULL,
//       password TEXT NOT NULL,
//       email TEXT UNIQUE,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `,
//     (err) => {
//       if (err) {
//         console.error(
//           "❌ Fehler beim Erstellen der users-Tabelle:",
//           err.message
//         );
//       } else {
//         console.log("✅ users-Tabelle geprüft oder erstellt");
//       }
//     }
//   );

//   // Neue Tabellen für Rollen und Rechte
//   db.run(`
//       CREATE TABLE IF NOT EXISTS roles (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT UNIQUE NOT NULL
//       )
//     `);

//   db.run(`
//       CREATE TABLE IF NOT EXISTS role_permissions (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         role_id INTEGER NOT NULL,
//         area TEXT NOT NULL,
//         can_read BOOLEAN DEFAULT 0,
//         can_write BOOLEAN DEFAULT 0,
//         FOREIGN KEY (role_id) REFERENCES roles(id)
//       )
//     `);

//   db.run(`
//       CREATE TABLE IF NOT EXISTS user_roles (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         user_id INTEGER NOT NULL,
//         role_id INTEGER NOT NULL,
//         FOREIGN KEY (user_id) REFERENCES users(id),
//         FOREIGN KEY (role_id) REFERENCES roles(id)
//       )
//     `);

//   // Beispielrollen einfügen
//   db.run(
//     `INSERT OR IGNORE INTO roles (id, name) VALUES (1, 'master'), (2, 'admin')`
//   );

//   // Beispielrechte einfügen
//   db.run(`INSERT OR IGNORE INTO role_permissions (role_id, area, can_read, can_write) VALUES
//       (1, 'transactions', 1, 1),
//       (1, 'users', 1, 1),
//       (1, 'events', 1, 1),
//       (2, 'transactions', 1, 1),
//       (2, 'users', 1, 1),
//       (2, 'events', 1, 1)
//     `);
// });

//app.use(express.json());

// API-Endpunkt, um Transaktionen zu speichern
// app.post(
//   "/api/transactions",
//   verifyToken,
//   checkRolePermission("transactions", "write"),
//   (req, res) => {
//     const { title, amount, date, category, type } = req.body;
//     const sql = `INSERT INTO transactions (title, amount, date, category, type) VALUES (?, ?, ?, ?, ?)`;
//     db.run(sql, [title, amount, date, category, type], function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.status(200).json({ id: this.lastID });
//     });
//   }
// );

// // API-Endpunkt, um Transaktionen abzurufen
// app.get(
//   "/api/transactions",
//   verifyToken,
//   checkRolePermission("transactions", "read"),
//   (req, res) => {
//     const sql = "SELECT * FROM transactions ORDER BY date DESC";
//     db.all(sql, [], (err, rows) => {
//       if (err) {
//         console.error("Fehler beim Abrufen der Transaktionen:", err);
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(200).json(rows);
//     });
//   }
// );

// // API-Endpunkt, um eine Transaktion zu aktualisieren
// app.put(
//   "/api/transactions/:id",
//   verifyToken,
//   checkRolePermission("transactions", "write"),
//   (req, res) => {
//     const { title, amount, date, category, type } = req.body;
//     const { id } = req.params;
//     const sql = `UPDATE transactions SET title = ?, amount = ?, date = ?, category = ?, type = ? WHERE id = ?`;
//     db.run(sql, [title, amount, date, category, type, id], function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.status(200).json({ updated: this.changes });
//     });
//   }
// );

// // API-Endpunkt, um eine Transaktion zu löschen
// app.delete(
//   "/api/transactions/:id",
//   verifyToken,
//   checkRolePermission("transactions", "write"),
//   (req, res) => {
//     const { id } = req.params;
//     const sql = `DELETE FROM transactions WHERE id = ?`;
//     db.run(sql, id, function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.status(200).json({ deleted: this.changes });
//     });
//   }
// );

// // API-Endpunkt, um Events zu speichern
// app.post(
//   "/api/events",
//   verifyToken,
//   checkRolePermission("events", "write"),
//   (req, res) => {
//     const { title, date, description, location } = req.body;
//     const sql = `INSERT INTO events (title, date, description, location) VALUES (?, ?, ?, ?)`;
//     db.run(sql, [title, date, description, location], function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.status(200).json({ id: this.lastID });
//     });
//   }
// );

// // API-Endpunkt, um Events abzurufen
// app.get(
//   "/api/events",
//   verifyToken,
//   checkRolePermission("events", "read"),
//   (req, res) => {
//     const sql = "SELECT * FROM events ORDER BY date DESC";
//     db.all(sql, [], (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.status(200).json(rows);
//     });
//   }
// );
// //Gibt alle Benutzer + ggf. ihre Rolle zurück – nur zugänglich mit users.read:
// app.get(
//   "/api/users",
//   verifyToken,
//   checkRolePermission("users", "read"),
//   (req, res) => {
//     const sql = `
//     SELECT 
//       u.id, u.username, u.email, u.created_at, r.name AS role
//     FROM users u
//     LEFT JOIN user_roles ur ON ur.user_id = u.id
//     LEFT JOIN roles r ON r.id = ur.role_id
//     ORDER BY u.created_at ASC
//   `;
//     db.all(sql, [], (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(rows);
//     });
//   }
// );
// //Aufruf Rollen
// app.get(
//   "/api/roles",
//   verifyToken,
//   checkRolePermission("users", "read"),
//   (req, res) => {
//     db.all(`SELECT id, name FROM roles`, [], (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(rows);
//     });
//   }
// );

// //Zum Zuweisen oder Aktualisieren einer Rolle – nur mit users.write.
// app.post(
//   "/api/user-roles",
//   verifyToken,
//   checkRolePermission("users", "write"),
//   (req, res) => {
//     const { userId, roleId } = req.body;
//     if (!userId || !roleId) {
//       return res.status(400).json({ error: "userId und roleId erforderlich" });
//     }
//     if (roleId !== 1) {
//       db.get(
//         `SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ?`,
//         [userId],
//         (err, row) => {
//           if (row && row.name === "master") {
//             return res
//               .status(403)
//               .json({
//                 error:
//                   "Die Rolle des Master-Accounts kann nicht geändert werden.",
//               });
//           }
//         }
//       );

//       const checkSql = `SELECT id FROM user_roles WHERE user_id = ?`;
//       db.get(checkSql, [userId], (err, row) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (row) {
//           // Rolle aktualisieren
//           const updateSql = `UPDATE user_roles SET role_id = ? WHERE user_id = ?`;
//           db.run(updateSql, [roleId, userId], function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ updated: true });
//           });
//         } else {
//           // Neue Rolle zuweisen
//           const insertSql = `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`;
//           db.run(insertSql, [userId, roleId], function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ assigned: true });
//           });
//         }
//       });
//     }
//   }
// );

// // API-Endpunkt Login und Registrierung

// // Registrierung

// const REGISTRATION_KEY = "mein-geheimer-invite-code"; // später aus .env lesen
// app.post("/api/register", async (req, res) => {
//   const { username, password, email, accessKey } = req.body;

//   if (accessKey !== REGISTRATION_KEY) {
//     return res
//       .status(403)
//       .json({ error: "Ungültiger Registrierungsschlüssel" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const stmt = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
//   db.run(stmt, [username, hashedPassword, email], function (err) {
//     if (err) {
//       return res
//         .status(400)
//         .json({ error: "Benutzername oder E-Mail bereits vergeben" });
//     }
//     res.status(201).json({ id: this.lastID });
//   });
// });

// // Login

// const SECRET_KEY = "dein_super_geheimes_token"; // später in ENV-Datei!
// app.post("/api/login", (req, res) => {
//   const { username, password } = req.body;
//   db.get(
//     `SELECT * FROM users WHERE username = ? or email= ?`,
//     [username, username],
//     async (err, user) => {
//       if (err || !user)
//         return res
//           .status(401)
//           .json({ error: "Ungültiger Benutzername oder Passwort" });

//       const match = await bcrypt.compare(password, user.password);
//       if (!match) return res.status(401).json({ error: "Falsches Passwort" });

//       const token = jwt.sign(
//         { id: user.id, username: user.username },
//         SECRET_KEY,
//         { expiresIn: "2h" }
//       );
//       res.json({ token, user: { id: user.id, username: user.username } });
//     }
//   );
// });

// app.get('/api/me', verifyToken, (req, res) => {
//   const userId = req.user.id;
//   const userSql = `SELECT id, username, email, created_at FROM users WHERE id = ?`;

//   db.get(userSql, [userId], (err, user) => {
//     if (err || !user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

//     const permSql = `
//       SELECT area, can_read, can_write
//       FROM user_roles ur
//       JOIN role_permissions rp ON ur.role_id = rp.role_id
//       WHERE ur.user_id = ?
//     `;

//     db.all(permSql, [userId], (err, permissions) => {
//       if (err) return res.status(500).json({ error: 'Fehler beim Laden der Berechtigungen' });

//       const rights = {};
//       permissions.forEach(p => {
//         rights[p.area] = { read: !!p.can_read, write: !!p.can_write };
//       });

//       res.json({ ...user, rights }); // ← wichtig
//     });
//   });
// });


// Starten des Servers
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
