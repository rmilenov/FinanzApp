-- Tabelle für Rollen
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL -- z. B. 'master', 'admin'
);

-- Berechtigungen pro Rolle für jede App-Sektion
CREATE TABLE IF NOT EXISTS role_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL,
  area TEXT NOT NULL,               -- 'transactions', 'users', 'events'
  can_read BOOLEAN DEFAULT 0,
  can_write BOOLEAN DEFAULT 0,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Benutzer-Rollen-Zuordnung
CREATE TABLE IF NOT EXISTS user_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
