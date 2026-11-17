const express = require('express');
const router = express.Router();
const requerirAuth = require('../middlewares/auth');
const controller = require('../controllers/favoritosController');

router.use(requerirAuth);
router.get('/', controller.listar);
router.post('/', controller.agregar);
router.delete('/:productoId', controller.quitar);

module.exports = router;
