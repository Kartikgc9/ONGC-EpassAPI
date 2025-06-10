const express = require('express');
const router = express.Router();
const { readEpassData } = require('../config/db');

// Existing endpoint: GET /api/visitors
console.log('Registering route: /');
router.get('/', async (req, res) => {
  try {
    const epassData = await readEpassData();
    res.json(epassData);
  } catch (error) {
    console.error('Error fetching e-pass data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing endpoint: GET /api/visitors/filter
console.log('Registering route: /filter');
router.get('/filter', async (req, res) => {
  try {
    const epassData = await readEpassData();
    const { date, location } = req.query;
    let filteredData = epassData;

    if (date) {
      filteredData = filteredData.filter((entry) => entry.date === date);
    }
    if (location) {
      filteredData = filteredData.filter((entry) => entry.location === location);
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Error filtering e-pass data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing endpoint: GET /api/visitors/total
console.log('Registering route: /total');
router.get('/total', async (req, res) => {
  try {
    const epassData = await readEpassData();
    res.json({ total: epassData.length });
  } catch (error) {
    console.error('Error calculating total visitors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing endpoint: GET /api/visitors/visits-per-employee
console.log('Registering route: /visits-per-employee');
router.get('/visits-per-employee', async (req, res) => {
  try {
    const epassData = await readEpassData();
    const visitsPerEmployee = epassData.reduce((acc, entry) => {
      const employee = entry.employee_to_meet;
      acc[employee] = (acc[employee] || 0) + 1;
      return acc;
    }, {});
    res.json(visitsPerEmployee);
  } catch (error) {
    console.error('Error calculating visits per employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing endpoint: GET /api/visitors/purpose-breakdown
console.log('Registering route: /purpose-breakdown');
router.get('/purpose-breakdown', async (req, res) => {
  try {
    const epassData = await readEpassData();
    const purposeBreakdown = epassData.reduce((acc, entry) => {
      const purpose = entry.purpose_of_visit;
      acc[purpose] = (acc[purpose] || 0) + 1;
      return acc;
    }, {});
    res.json(purposeBreakdown);
  } catch (error) {
    console.error('Error calculating purpose breakdown:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing endpoint: GET /api/visitors/visits-by-date
console.log('Registering route: /visits-by-date');
router.get('/visits-by-date', async (req, res) => {
  try {
    const epassData = await readEpassData();
    const visitsByDate = epassData.reduce((acc, entry) => {
      const date = entry.date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    res.json(visitsByDate);
  } catch (error) {
    console.error('Error calculating visits by date:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing endpoint: GET /api/visitors/visits-by-location
console.log('Registering route: /visits-by-location');
router.get('/visits-by-location', async (req, res) => {
  try {
    const epassData = await readEpassData();
    const visitsByLocation = epassData.reduce((acc, entry) => {
      const location = entry.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    res.json(visitsByLocation);
  } catch (error) {
    console.error('Error calculating visits by location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// New endpoint: GET /api/visitors/by-date-time
console.log('Registering route: /by-date-time');
router.get('/by-date-time', async (req, res) => {
  try {
    const { date, time } = req.query;

    // Validate query parameters
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time query parameters are required' });
    }

    const epassData = await readEpassData();

    // Filter entries for the given date and time
    const matchingEntries = epassData.filter(
      (entry) => entry.date === date && entry.time === time
    );

    if (matchingEntries.length === 0) {
      return res.status(404).json({ message: 'No visitors found for the specified date and time' });
    }

    // Calculate the total number of visits by each visitor to each employee
    const visitCounts = epassData.reduce((acc, entry) => {
      const key = `${entry.visitor_name}:${entry.employee_to_meet}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Add visit count to each matching entry
    const result = matchingEntries.map((entry) => ({
      ...entry,
      visit_count_to_employee: visitCounts[`${entry.visitor_name}:${entry.employee_to_meet}`]
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching visitors by date and time:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;