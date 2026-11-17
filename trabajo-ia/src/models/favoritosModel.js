const { query } = require('../config/db');

const listar = async (usuarioId) => {
  const result = await query(
    `SELECT p.* FROM favoritos f
     JOIN productos p ON p.id = f.producto_id
     WHERE f.usuario_id = $1 AND p.activo = TRUE
     ORDER BY f.creado_en DESC`,
    [usuarioId]
  );
  return result.rows;
};

const agregar = async (usuarioId, productoId) => {
  const result = await query(
    `INSERT INTO favoritos (usuario_id, producto_id) VALUES ($1, $2)
     ON CONFLICT (usuario_id, producto_id) DO NOTHING RETURNING *`,
    [usuarioId, productoId]
  );
  return result.rows[0] || null;
};

const quitar = async (usuarioId, productoId) => {
  const result = await query('DELETE FROM favoritos WHERE usuario_id = $1 AND producto_id = $2', [usuarioId, productoId]);
  return result.rowCount > 0;
};

module.exports = { listar, agregar, quitar };
