const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/fastapi-data', dataController.getFastApiData);

module.exports = router;
