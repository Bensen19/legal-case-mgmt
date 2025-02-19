const { Pool } = require('pg');
require('dotenv').config(); // ✅ Loads environment variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // ✅ Enables SSL for AWS RDS
  }
});

module.exports = pool; // ✅ Ensures the pool is properly exported



