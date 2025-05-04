const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const checkRolePermission = require('../middleware/checkRolePermissions');

// Benutzer mit Rollen abrufen
router.get(
  '/users',
  verifyToken,
  checkRolePermission('users', 'read'),
  userController.getAllUsers
);

// Rollen abrufen
router.get(
  '/roles',
  verifyToken,
  checkRolePermission('users', 'read'),
  userController.getRoles
);

// Rolle zuweisen oder aktualisieren
router.post(
  '/user-roles',
  verifyToken,
  checkRolePermission('users', 'write'),
  userController.assignOrUpdateRole
);

module.exports = router;
