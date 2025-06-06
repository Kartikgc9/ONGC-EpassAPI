const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const visitorRoutes = require('./routes/visitors');
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
  res.send('Welcome to the Authentication API! Use POST /api/auth/login to log in, GET /api/data for sample data, and GET /api/visitors for e-pass data.');
});

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/visitors', verifyToken, visitorRoutes);

// Comment out the fallback route to test
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));