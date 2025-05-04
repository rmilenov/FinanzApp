const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const verifyToken = require('../middleware/verifyToken');
const checkRolePermission = require('../middleware/checkRolePermissions');

// Neue Transaktion
router.post(
  '/transactions',
  verifyToken,
  checkRolePermission('transactions', 'write'),
  transactionController.create
);

// Alle Transaktionen abrufen
router.get(
  '/transactions',
  verifyToken,
  checkRolePermission('transactions', 'read'),
  transactionController.getAll
);

// Transaktion aktualisieren
router.put(
  '/transactions/:id',
  verifyToken,
  checkRolePermission('transactions', 'write'),
  transactionController.update
);

// Transaktion löschen
router.delete(
  '/transactions/:id',
  verifyToken,
  checkRolePermission('transactions', 'write'),
  transactionController.remove
);

module.exports = router;
