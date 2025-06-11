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

// Existing endpoint: POST /api/visitors/by-date-time
console.log('Registering route: /by-date-time');
router.post('/by-date-time', async (req, res) => {
  try {
    const { startDate, startTime, endDate, endTime } = req.body;

    // Validate request body
    if (!startDate || !startTime || !endDate || !endTime) {
      return res.status(400).json({ message: 'startDate, startTime, endDate, and endTime are required in the request body' });
    }

    const epassData = await readEpassData();

    // Convert date and time to comparable format
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      return res.status(400).json({ message: 'Invalid date or time format. Use YYYY-MM-DD for dates and HH:mm for times.' });
    }

    if (startDateTime > endDateTime) {
      return res.status(400).json({ message: 'startDate and startTime must be before endDate and endTime' });
    }

    // Filter entries within the date and time range
    const matchingEntries = epassData.filter((entry) => {
      const entryDateTime = new Date(`${entry.date}T${entry.time}:00`);
      return entryDateTime >= startDateTime && entryDateTime <= endDateTime;
    });

    if (matchingEntries.length === 0) {
      return res.status(404).json({ message: 'No visitors found within the specified date and time range' });
    }

    // Calculate the total number of visits by each visitor to each employee (across all data)
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
    console.error('Error fetching visitors by date and time range:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Updated endpoint: POST /api/visitors/by-id
console.log('Registering route: /by-id');
router.post('/by-id', async (req, res) => {
  try {
    const { id } = req.body;

    // Validate the ID in the request body
    if (!id) {
      return res.status(400).json({ message: 'ID is required in the request body' });
    }

    const visitorId = parseInt(id, 10);
    if (isNaN(visitorId) || visitorId <= 0) {
      return res.status(400).json({ message: 'Invalid ID. ID must be a positive integer.' });
    }

    const epassData = await readEpassData();

    // Find the visitor record with the matching ID
    const visitor = epassData.find((entry) => entry.id === visitorId);

    if (!visitor) {
      return res.status(404).json({ message: `No visitor found with ID ${visitorId}` });
    }

    // Calculate the total number of visits by this visitor to this employee (across all data)
    const visitCounts = epassData.reduce((acc, entry) => {
      const key = `${entry.visitor_name}:${entry.employee_to_meet}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Add visit count to the visitor record
    const result = {
      ...visitor,
      visit_count_to_employee: visitCounts[`${visitor.visitor_name}:${visitor.employee_to_meet}`]
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching visitor by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;