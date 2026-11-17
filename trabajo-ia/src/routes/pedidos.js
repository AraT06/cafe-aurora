const express = require('express');
const router = express.Router();
const requerirAuth = require('../middlewares/auth');
const controller = require('../controllers/pedidosController');

router.use(requerirAuth);
router.get('/', controller.listar);
router.get('/:id', controller.obtenerDetalle);

module.exports = router;
