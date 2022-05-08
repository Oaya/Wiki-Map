// PG database client/connection setup
const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.ENVIRONMENT === 'production' ? {
    rejectUnauthorized: false
  } : false
});

module.exports = db;
