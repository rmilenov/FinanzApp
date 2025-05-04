const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require("../middleware/verifyToken");

// Registrierung mit Invite-Key
router.post('/register', authController.register);

// Login mit Username oder E-Mail
router.post('/login', authController.login);

// Aktuellen Benutzer inkl. Rechte abrufen
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
