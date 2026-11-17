const { query } = require('../config/db');

const listar = async (usuarioId) => {
  const result = await query(
    `SELECT p.id AS producto_id, p.nombre, p.descripcion, p.imagen, p.precio, c.cantidad
     FROM carrito_items c
     JOIN productos p ON p.id = c.producto_id
     WHERE c.usuario_id = $1 AND p.activo = TRUE
     ORDER BY c.creado_en`,
    [usuarioId]
  );
  return result.rows;
};

const agregarOActualizar = async (usuarioId, productoId, cantidad) => {
  const result = await query(
    `INSERT INTO carrito_items (usuario_id, producto_id, cantidad)
     VALUES ($1, $2, $3)
     ON CONFLICT (usuario_id, producto_id)
     DO UPDATE SET cantidad = carrito_items.cantidad + EXCLUDED.cantidad
     RETURNING *`,
    [usuarioId, productoId, cantidad]
  );
  return result.rows[0];
};

const actualizarCantidad = async (usuarioId, productoId, cantidad) => {
  const result = await query(
    'UPDATE carrito_items SET cantidad = $3 WHERE usuario_id = $1 AND producto_id = $2 RETURNING *',
    [usuarioId, productoId, cantidad]
  );
  return result.rows[0] || null;
};

const eliminarItem = async (usuarioId, productoId) => {
  const result = await query('DELETE FROM carrito_items WHERE usuario_id = $1 AND producto_id = $2', [usuarioId, productoId]);
  return result.rowCount > 0;
};

module.exports = { listar, agregarOActualizar, actualizarCantidad, eliminarItem };
