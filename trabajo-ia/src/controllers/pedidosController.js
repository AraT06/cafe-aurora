const pedidosModel = require('../models/pedidosModel');

const listar = async (req, res, next) => {
  try {
    res.json(await pedidosModel.listarPorUsuario(req.usuario.id));
  } catch (error) {
    next(error);
  }
};

const obtenerDetalle = async (req, res, next) => {
  try {
    const pedido = await pedidosModel.obtenerDetalle(req.usuario.id, Number.parseInt(req.params.id, 10));
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, obtenerDetalle };
