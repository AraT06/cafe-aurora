const { query } = require('../config/db');

const crear = async ({ nombre, correo, telefono, mensaje }) => {
  const result = await query(
    `INSERT INTO mensajes_contacto (nombre, correo, telefono, mensaje)
     VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, telefono, mensaje, fecha`,
    [nombre, correo, telefono || null, mensaje]
  );
  return result.rows[0];
};

module.exports = { crear };
