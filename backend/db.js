const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../data.db'), (err) => {
  if (err) return console.error('❌ Fehler beim Öffnen der DB:', err.message);
  console.log('✅ SQLite-Datenbank verbunden');
});

db.serialize(() => {
  // Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Roles
  db.run(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // Role Permissions
  db.run(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,
      area TEXT NOT NULL,
      can_read BOOLEAN DEFAULT 0,
      can_write BOOLEAN DEFAULT 0,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    )
  `);

  // User Roles
  db.run(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (role_id) REFERENCES roles(id)
    )
  `);

  // Transactions
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      type TEXT NOT NULL
    )
  `);

  // Events
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      location TEXT
    )
  `);

  // Beispielrollen einfügen (nur bei Erststart)
  db.run(`
    INSERT OR IGNORE INTO roles (id, name)
    VALUES (1, 'master'), (2, 'admin')
  `);

  // Beispielrechte einfügen (nur bei Erststart)
  db.run(`
    INSERT OR IGNORE INTO role_permissions (role_id, area, can_read, can_write)
    VALUES
      (1, 'transactions', 1, 1),
      (1, 'users', 1, 1),
      (1, 'events', 1, 1),
      (2, 'transactions', 1, 1),
      (2, 'users', 1, 1),
      (2, 'events', 1, 1)
  `);
});

module.exports = db;
