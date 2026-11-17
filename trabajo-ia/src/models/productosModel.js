const { query } = require('../config/db');

const productosTest = [
  { id: 1, nombre: 'Teclado', precio: 25.99 },
  { id: 2, nombre: 'Mouse', precio: 12.5 },
  { id: 3, nombre: 'Monitor', precio: 149.0 }
];

const enPruebas = process.env.NODE_ENV === 'test';
const obtenerTodos = async () => enPruebas ? productosTest : (await query('SELECT * FROM productos WHERE activo = TRUE ORDER BY id')).rows;
const obtenerPorId = async (id) => enPruebas ? productosTest.find((producto) => producto.id === id) : (await query('SELECT * FROM productos WHERE id = $1 AND activo = TRUE', [id])).rows[0];

const crear = async ({ nombre, precio, descripcion, categoria, imagen }) => {
  if (enPruebas) {
    const nuevo = { id: productosTest.length + 1, nombre, precio };
    productosTest.push(nuevo);
    return nuevo;
  }
  const result = await query(
    `INSERT INTO productos (nombre, precio, descripcion, categoria, imagen)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, precio, descripcion || null, categoria || null, imagen || null]
  );
  return result.rows[0];
};

const actualizar = async (id, datos) => {
  if (enPruebas) {
    const index = productosTest.findIndex((producto) => producto.id === id);
    if (index < 0) return null;
    productosTest[index] = { ...productosTest[index], ...datos };
    return productosTest[index];
  }
  const result = await query(
    `UPDATE productos SET nombre = COALESCE($2, nombre), precio = COALESCE($3, precio),
     descripcion = COALESCE($4, descripcion), categoria = COALESCE($5, categoria), imagen = COALESCE($6, imagen)
     WHERE id = $1 AND activo = TRUE RETURNING *`,
    [id, datos.nombre, datos.precio, datos.descripcion, datos.categoria, datos.imagen]
  );
  return result.rows[0] || null;
};

const eliminar = async (id) => {
  if (enPruebas) {
    const index = productosTest.findIndex((producto) => producto.id === id);
    if (index < 0) return false;
    productosTest.splice(index, 1);
    return true;
  }
  const result = await query('UPDATE productos SET activo = FALSE WHERE id = $1 AND activo = TRUE RETURNING id', [id]);
  return result.rowCount > 0;
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
