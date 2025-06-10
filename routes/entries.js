const express = require('express');
const router = express.Router();
const { readEntries, writeEntries } = require('../config/db');
const verifyToken = require('../middleware/auth');

// POST /api/entries - Record a new date and time entry
router.post('/', verifyToken, async (req, res) => {
  const { date, time } = req.body;

  // Validate request body
  if (!date || !time) {
    return res.status(400).json({ message: 'Date and time are required' });
  }

  try {
    // Get the current entries
    const entries = await readEntries();

    // Add the new entry with the user ID from the JWT token
    const newEntry = {
      userId: req.user.id, // From verifyToken middleware (decoded JWT)
      date,
      time
    };
    entries.push(newEntry);

    // Save the updated entries
    await writeEntries(entries);

    res.status(201).json({ message: 'Entry recorded successfully' });
  } catch (error) {
    console.error('Error recording entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;