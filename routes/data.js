const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { readSampleData } = require('../config/db');

router.get('/', verifyToken, async (req, res) => {
  const sampleData = await readSampleData();
  res.json(sampleData);
});

module.exports = router;