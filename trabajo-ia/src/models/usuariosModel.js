const { query } = require('../config/db');

const crear = async ({ nombre, correo, passwordHash }) => {
  const result = await query(
    'INSERT INTO usuarios (nombre, correo, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, correo, creado_en',
    [nombre, correo, passwordHash]
  );
  return result.rows[0];
};

const buscarPorCorreo = async (correo) => {
  const result = await query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
  return result.rows[0] || null;
};

const buscarPorId = async (id) => {
  const result = await query('SELECT id, nombre, correo, creado_en FROM usuarios WHERE id = $1', [id]);
  return result.rows[0] || null;
};

module.exports = { crear, buscarPorCorreo, buscarPorId };
