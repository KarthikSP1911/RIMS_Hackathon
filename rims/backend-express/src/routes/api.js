const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Public route example (previous)
const dataController = require('../controllers/dataController');
router.get('/fastapi-data', dataController.getFastApiData);

module.exports = router;
