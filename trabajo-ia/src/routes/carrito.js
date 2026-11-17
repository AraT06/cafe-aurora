const express = require('express');
const router = express.Router();
const requerirAuth = require('../middlewares/auth');
const controller = require('../controllers/carritoController');

router.use(requerirAuth);
router.get('/', controller.obtener);
router.post('/', controller.agregar);
router.post('/checkout', controller.checkout);
router.put('/:productoId', controller.actualizar);
router.delete('/:productoId', controller.eliminar);

module.exports = router;
