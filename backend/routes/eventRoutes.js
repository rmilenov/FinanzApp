const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const verifyToken = require('../middleware/verifyToken');
const checkRolePermission = require('../middleware/checkRolePermissions');

// Neues Event
router.post(
  '/events',
  verifyToken,
  checkRolePermission('events', 'write'),
  eventController.create
);

// Alle Events
router.get(
  '/events',
  verifyToken,
  checkRolePermission('events', 'read'),
  eventController.getAll
);

// Event bearbeiten
router.put(
  '/events/:id',
  verifyToken,
  checkRolePermission('events', 'write'),
  eventController.update
);

// Event löschen
router.delete(
  '/events/:id',
  verifyToken,
  checkRolePermission('events', 'write'),
  eventController.remove
);

module.exports = router; // ✅ Direktes Exportieren des Routers
// ❌ Verwenden Sie stattdessen einen Export mit einem Namen, wie z.B. "router"