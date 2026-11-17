const express = require('express');
const controller = require('../controllers/catalogController');
const router = express.Router();

router.get('/servicios', controller.obtenerServicios);
router.get('/especialidades', controller.obtenerEspecialidades);
router.get('/galeria', controller.obtenerGaleria);

module.exports = router;
