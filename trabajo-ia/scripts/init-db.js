require('../src/config/env');
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

const run = async () => {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Base de datos PostgreSQL inicializada correctamente.');
};

run().catch((error) => {
  console.error('No se pudo inicializar la base de datos:', error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
