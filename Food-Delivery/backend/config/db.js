const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '{Niranjan03}', // your password
  database: 'food_delivery', // your DB name
});

module.exports = db;
