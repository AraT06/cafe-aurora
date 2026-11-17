const express = require('express');
const controller = require('../controllers/cafeteriaController');
const router = express.Router();

router.get('/', controller.obtenerInformacion);

module.exports = router;
