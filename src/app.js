require('dotenv').config({quiet: true});
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db');
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
// Health check with DB
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: result.rows[0].now,
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: err.message 
    });
  }
});


 app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
 app.use('/api/v1/users', require('./modules/users/user.routes'));
 app.use('/api/v1/admin', require('./modules/admin/admin.routes'));

module.exports = app;
