const express = require('express');
const controller = require('../controllers/contactosController');
const router = express.Router();

router.post('/', controller.crearContacto);

module.exports = router;
