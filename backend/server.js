const express = require('express');
const corsOptions = require('./config/corsOptions');
const cors = require('cors');
const db = require('./db');

function safeImportRoute(path, label) {
    try {
      const route = require(path);
      const usable = typeof route === 'function' && typeof route.use === 'function';
  
      console.log(`➡️ Versuche zu laden: ${path}`);
      console.log(`[${label}] typeof: ${typeof route} has .use: ${route && route.use ? '✅' : '❌'}`);
  
      if (usable) {
        console.log(`✅ [${label}] erfolgreich geladen`);
        return route;
      } else {
        console.warn(`⚠️ [${label}] ist KEIN gültiger Express Router`);
        return null;
      }
    } catch (err) {
      console.error(`❌ Fehler beim Laden von [${label}]:`, err.message);
      return null;
    }
  }

const eventRoutes = safeImportRoute('./routes/eventRoutes', 'eventRoutes');
const transactionRoutes = safeImportRoute('./routes/transactionRoutes', 'transactionRoutes');
const userRoutes = safeImportRoute('./routes/userRoutes', 'userRoutes');
const authRoutes = safeImportRoute('./routes/authRoutes', 'authRoutes');

const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
if (eventRoutes) app.use('/api', eventRoutes);
if (transactionRoutes) app.use('/api', transactionRoutes);
if (userRoutes) app.use('/api', userRoutes);
if (authRoutes) app.use('/api', authRoutes);
  

 // <- Verbindung + Tabellen
// const eventRoutes = require('./routes/eventRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes'); // Falls noch nicht ausgelagert
require('dotenv').config();





// JSON-Parser aktivieren
app.use(express.json());

// API-Routen
// app.use('/api', eventRoutes);
// app.use('/api', transactionRoutes);
// app.use('/api', userRoutes);
// app.use('/api', authRoutes); // /login, /register, /me


  //db.connect(); // <- Verbindung + Tabellen



// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
