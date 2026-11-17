const { query } = require('../config/db');

const tables = { servicios: 'servicios', especialidades: 'especialidades', galeria: 'galeria' };

const obtenerTodos = async (tipo) => {
  const result = await query(`SELECT * FROM ${tables[tipo]} WHERE activo = TRUE ORDER BY id`);
  return result.rows;
};

module.exports = { obtenerTodos };
