const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const visitorRoutes = require('./routes/visitors');
const entriesRoutes = require('./routes/entries');
const verifyToken = require('./middleware/auth');

const app = express();
const PORT = 3000;

console.log('verifyToken:', typeof verifyToken);
console.log('visitorRoutes:', typeof visitorRoutes);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    console.log('Serving static file:', path);
  }
}));

app.get('/', (req, res) => {
  res.send('Welcome to the Authentication API! Use POST /api/auth/login to log in, GET /api/data for sample data, GET /api/visitors for e-pass data, POST /api/visitors/by-date-time with a body containing startDate, startTime, endDate, and endTime for visitor details by date and time range, POST /api/visitors/by-id with a body containing id to get visitor details by ID, and POST /api/entries to record date and time.');
});

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/visitors', verifyToken, visitorRoutes);
app.use('/api/entries', entriesRoutes);

// Comment out the fallback route to avoid path-to-regexp error
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));