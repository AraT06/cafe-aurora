const productosModel = require('../models/productosModel');

const obtenerProductos = async (req, res, next) => {
  try { res.json(await productosModel.obtenerTodos()); } catch (error) { next(error); }
};

const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await productosModel.obtenerPorId(Number.parseInt(req.params.id, 10));
    if (producto) return res.json(producto);
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  } catch (error) { next(error); }
};

const crearProducto = async (req, res, next) => {
  try {
    const { nombre, precio, descripcion, categoria, imagen } = req.body;
    if (!nombre || precio === undefined) return res.status(400).json({ mensaje: 'nombre y precio son obligatorios' });
    res.status(201).json(await productosModel.crear({ nombre, precio, descripcion, categoria, imagen }));
  } catch (error) { next(error); }
};

const actualizarProducto = async (req, res, next) => {
  try {
    const producto = await productosModel.actualizar(Number.parseInt(req.params.id, 10), req.body);
    if (producto) return res.json(producto);
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  } catch (error) { next(error); }
};

const eliminarProducto = async (req, res, next) => {
  try {
    if (await productosModel.eliminar(Number.parseInt(req.params.id, 10))) return res.status(204).send();
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  } catch (error) { next(error); }
};

module.exports = { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto };
