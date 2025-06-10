const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// Generate a new hash for the password "password123" each time the module is loaded
const password = 'password123';
const saltRounds = 10;
const newHash = bcrypt.hashSync(password, saltRounds);
console.log('Generated new hash for "password123":', newHash);

const users = [
  { id: 1, username: 'admin', password: newHash } // Password: "password123"
];

// For sample data (used by /api/data)
const sampleDataPath = path.join(__dirname, '../data/sampleData.json');
// For e-pass data (used by /api/visitors)
const epassDataPath = path.join(__dirname, '../data/epass.json');
// For user entries (used by /api/entries)
const entriesDataPath = path.join(__dirname, '../data/entries.json');

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

// New functions for entries
const readEntries = async () => {
  try {
    const data = await fs.readFile(entriesDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(entriesDataPath, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

const writeEntries = async (data) => {
  await fs.writeFile(entriesDataPath, JSON.stringify(data, null, 2));
};

module.exports = { users, readSampleData, writeSampleData, readEpassData, writeEpassData, readEntries, writeEntries };