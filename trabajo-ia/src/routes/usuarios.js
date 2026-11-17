const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const requerirAuth = require('../middlewares/auth');

router.post('/registro', usuariosController.registrar);
router.post('/login', usuariosController.iniciarSesion);
router.get('/me', requerirAuth, usuariosController.obtenerPerfil);

module.exports = router;
