const catalogModel = require('../models/catalogModel');

const listar = (tipo) => async (req, res, next) => {
  try { res.json(await catalogModel.obtenerTodos(tipo)); } catch (error) { next(error); }
};

module.exports = {
  obtenerServicios: listar('servicios'),
  obtenerEspecialidades: listar('especialidades'),
  obtenerGaleria: listar('galeria')
};
