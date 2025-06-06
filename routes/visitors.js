const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

console.log('Registering route: /');
router.get('/', visitorController.getAllVisitors);

console.log('Registering route: /filter');
router.get('/filter', visitorController.filterVisitors);

console.log('Registering route: /total');
router.get('/total', visitorController.getTotalVisitors);

console.log('Registering route: /visits-per-employee');
router.get('/visits-per-employee', visitorController.getVisitsPerEmployee);

console.log('Registering route: /purpose-breakdown');
router.get('/purpose-breakdown', visitorController.getPurposeBreakdown);

console.log('Registering route: /visits-by-date');
router.get('/visits-by-date', visitorController.getVisitsByDate);

console.log('Registering route: /visits-by-location');
router.get('/visits-by-location', visitorController.getVisitsByLocation);

module.exports = router;