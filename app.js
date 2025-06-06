const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Authentication API! Use POST /api/auth/login to log in, and GET /api/data to access protected data.');
});

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));