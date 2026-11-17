const { query, pool } = require('../config/db');

const crearDesdeCarrito = async (usuarioId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const itemsResult = await client.query(
      `SELECT c.producto_id, c.cantidad, p.nombre, p.precio
       FROM carrito_items c
       JOIN productos p ON p.id = c.producto_id
       WHERE c.usuario_id = $1 AND p.activo = TRUE`,
      [usuarioId]
    );

    if (itemsResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const total = itemsResult.rows.reduce((suma, item) => suma + Number(item.precio) * item.cantidad, 0);

    const pedidoResult = await client.query(
      'INSERT INTO pedidos (usuario_id, total) VALUES ($1, $2) RETURNING *',
      [usuarioId, total]
    );
    const pedido = pedidoResult.rows[0];

    for (const item of itemsResult.rows) {
      await client.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad)
         VALUES ($1, $2, $3, $4, $5)`,
        [pedido.id, item.producto_id, item.nombre, item.precio, item.cantidad]
      );
    }

    await client.query('DELETE FROM carrito_items WHERE usuario_id = $1', [usuarioId]);
    await client.query('COMMIT');

    return { ...pedido, items: itemsResult.rows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const listarPorUsuario = async (usuarioId) => {
  const result = await query('SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY creado_en DESC', [usuarioId]);
  return result.rows;
};

const obtenerDetalle = async (usuarioId, pedidoId) => {
  const pedidoResult = await query('SELECT * FROM pedidos WHERE id = $1 AND usuario_id = $2', [pedidoId, usuarioId]);
  const pedido = pedidoResult.rows[0];
  if (!pedido) return null;
  const itemsResult = await query('SELECT * FROM pedido_items WHERE pedido_id = $1', [pedidoId]);
  return { ...pedido, items: itemsResult.rows };
};

module.exports = { crearDesdeCarrito, listarPorUsuario, obtenerDetalle };
