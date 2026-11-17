const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const requerirAuth = (req, res, next) => {
  const encabezado = req.headers.authorization || '';
  const [tipo, token] = encabezado.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Debes iniciar sesión' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.usuario = { id: payload.id, nombre: payload.nombre, correo: payload.correo };
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Sesión inválida o expirada' });
  }
};

module.exports = requerirAuth;
