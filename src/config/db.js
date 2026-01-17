const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // required for Supabase
  }
});

pool.query('SELECT 1')
  .then(() => console.log('✅ DB Connected Successfully'))
  .catch(err => console.error('❌ DB Connection Failed', err));

module.exports = pool;
