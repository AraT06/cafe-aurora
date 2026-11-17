const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuariosModel');
const { jwtSecret } = require('../config/env');

const generarToken = (usuario) =>
  jwt.sign({ id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }, jwtSecret, { expiresIn: '7d' });

const registrar = async (req, res, next) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: 'nombre, correo y password son obligatorios' });
    }
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      return res.status(400).json({ mensaje: 'El correo no es válido' });
    }
    if (password.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existente = await usuariosModel.buscarPorCorreo(correo);
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await usuariosModel.crear({ nombre, correo, passwordHash });
    res.status(201).json({ usuario, token: generarToken(usuario) });
  } catch (error) {
    next(error);
  }
};

const iniciarSesion = async (req, res, next) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'correo y password son obligatorios' });
    }

    const usuario = await usuariosModel.buscarPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const { password_hash, ...usuarioSinPassword } = usuario;
    res.json({ usuario: usuarioSinPassword, token: generarToken(usuarioSinPassword) });
  } catch (error) {
    next(error);
  }
};

const obtenerPerfil = async (req, res, next) => {
  try {
    const usuario = await usuariosModel.buscarPorId(req.usuario.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

module.exports = { registrar, iniciarSesion, obtenerPerfil };
