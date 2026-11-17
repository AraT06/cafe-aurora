const cafeteriaModel = require('../models/cafeteriaModel');

const obtenerInformacion = async (req, res, next) => {
  try {
    const informacion = await cafeteriaModel.obtenerInformacion();
    if (!informacion) return res.status(404).json({ mensaje: 'Información no encontrada' });
    res.json(informacion);
  } catch (error) { next(error); }
};

module.exports = { obtenerInformacion };
