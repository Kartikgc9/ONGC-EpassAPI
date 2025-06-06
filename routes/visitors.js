const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

router.get('/', visitorController.getAllVisitors);
router.get('/filter', visitorController.filterVisitors);

module.exports = router;