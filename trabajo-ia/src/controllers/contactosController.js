const contactosModel = require('../models/contactosModel');

const crearContacto = async (req, res, next) => {
  try {
    const { nombre, correo, telefono, mensaje } = req.body;
    if (!nombre || !correo || !mensaje) return res.status(400).json({ mensaje: 'nombre, correo y mensaje son obligatorios' });
    if (!/^\S+@\S+\.\S+$/.test(correo)) return res.status(400).json({ mensaje: 'El correo no es válido' });
    res.status(201).json(await contactosModel.crear({ nombre, correo, telefono, mensaje }));
  } catch (error) { next(error); }
};

module.exports = { crearContacto };
