const fs = require('fs').promises;
const path = require('path');

const users = [
  { id: 1, username: 'admin', password: '$2b$10$M5ctS.FhNPHS9t.txVQo0.BjZ6vGT.9tCj0xk7GG17wALBzKn5U6q' } // Password: "password123" (replace with your generated hash)
];

// For sample data (used by /api/data)
const sampleDataPath = path.join(__dirname, '../data/sampleData.json');
// For e-pass data (used by /api/visitors)
const epassDataPath = path.join(__dirname, '../data/epass.json');

const readSampleData = async () => {
  try {
    const data = await fs.readFile(sampleDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(sampleDataPath, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

const writeSampleData = async (data) => {
  await fs.writeFile(sampleDataPath, JSON.stringify(data, null, 2));
};

const readEpassData = async () => {
  try {
    const data = await fs.readFile(epassDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(epassDataPath, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

const writeEpassData = async (data) => {
  await fs.writeFile(epassDataPath, JSON.stringify(data, null, 2));
};

module.exports = { users, readSampleData, writeSampleData, readEpassData, writeEpassData };