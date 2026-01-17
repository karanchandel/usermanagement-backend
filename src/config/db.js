const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // 🔑 SUPABASE + RENDER FIX
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('connect', () => {
  console.log('✅ DB Connected (Postgres Pool)')
})

pool.on('error', (err) => {
  console.error('❌ DB Pool Error', err)
})

module.exports = pool
