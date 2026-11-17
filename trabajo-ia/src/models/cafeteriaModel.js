const { query } = require('../config/db');

const obtenerInformacion = async () => {
  const result = await query('SELECT * FROM informacion_cafeteria ORDER BY id LIMIT 1');
  return result.rows[0] || null;
};

module.exports = { obtenerInformacion };
