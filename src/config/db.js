const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,              // IMPORTANT for Supabase
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('✅ DB Connected');
});

pool.on('error', (err) => {
  console.error('❌ DB Error', err);
  process.exit(1);
});

module.exports = pool;
