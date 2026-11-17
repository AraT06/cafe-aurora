const carritoModel = require('../models/carritoModel');
const pedidosModel = require('../models/pedidosModel');

const calcularResumen = (items) => {
  const total = items.reduce((suma, item) => suma + Number(item.precio) * item.cantidad, 0);
  return { items, total: Number(total.toFixed(2)) };
};

const obtener = async (req, res, next) => {
  try {
    const items = await carritoModel.listar(req.usuario.id);
    res.json(calcularResumen(items));
  } catch (error) {
    next(error);
  }
};

const agregar = async (req, res, next) => {
  try {
    const productoId = Number.parseInt(req.body.productoId, 10);
    const cantidad = Number.parseInt(req.body.cantidad, 10) || 1;
    if (!productoId || cantidad < 1) {
      return res.status(400).json({ mensaje: 'productoId es obligatorio y cantidad debe ser mayor a 0' });
    }
    await carritoModel.agregarOActualizar(req.usuario.id, productoId, cantidad);
    const items = await carritoModel.listar(req.usuario.id);
    res.status(201).json(calcularResumen(items));
  } catch (error) {
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const productoId = Number.parseInt(req.params.productoId, 10);
    const cantidad = Number.parseInt(req.body.cantidad, 10);
    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ mensaje: 'cantidad debe ser mayor a 0' });
    }
    const actualizado = await carritoModel.actualizarCantidad(req.usuario.id, productoId, cantidad);
    if (!actualizado) return res.status(404).json({ mensaje: 'El producto no está en el carrito' });
    const items = await carritoModel.listar(req.usuario.id);
    res.json(calcularResumen(items));
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const productoId = Number.parseInt(req.params.productoId, 10);
    await carritoModel.eliminarItem(req.usuario.id, productoId);
    const items = await carritoModel.listar(req.usuario.id);
    res.json(calcularResumen(items));
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const pedido = await pedidosModel.crearDesdeCarrito(req.usuario.id);
    if (!pedido) return res.status(400).json({ mensaje: 'El carrito está vacío' });
    res.status(201).json(pedido);
  } catch (error) {
    next(error);
  }
};

module.exports = { obtener, agregar, actualizar, eliminar, checkout };
