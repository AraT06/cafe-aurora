const favoritosModel = require('../models/favoritosModel');

const listar = async (req, res, next) => {
  try {
    res.json(await favoritosModel.listar(req.usuario.id));
  } catch (error) {
    next(error);
  }
};

const agregar = async (req, res, next) => {
  try {
    const productoId = Number.parseInt(req.body.productoId, 10);
    if (!productoId) return res.status(400).json({ mensaje: 'productoId es obligatorio' });
    await favoritosModel.agregar(req.usuario.id, productoId);
    res.status(201).json({ mensaje: 'Agregado a favoritos' });
  } catch (error) {
    next(error);
  }
};

const quitar = async (req, res, next) => {
  try {
    const productoId = Number.parseInt(req.params.productoId, 10);
    const eliminado = await favoritosModel.quitar(req.usuario.id, productoId);
    if (!eliminado) return res.status(404).json({ mensaje: 'No estaba en favoritos' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, agregar, quitar };
