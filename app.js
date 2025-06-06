const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const visitorRoutes = require('./routes/visitors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/visitors', visitorRoutes);

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
});