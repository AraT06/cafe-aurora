const express = require('express');
const cors = require('cors');
const app = express();
require('./config/env');
const { port } = require('./config/env');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const logger = require('./middlewares/logger');
const catalogoRoutes = require('./routes/catalogo');
const cafeteriaRoutes = require('./routes/cafeteria');
const contactosRoutes = require('./routes/contactos');
const chatbotRoutes = require('./routes/chatbot');
const favoritosRoutes = require('./routes/favoritos');
const carritoRoutes = require('./routes/carrito');
const pedidosRoutes = require('./routes/pedidos');

app.use(cors());
app.use(express.json());
app.use(logger);

// Usar las rutas de usuarios bajo el prefijo '/usuarios'
app.use('/usuarios', usuariosRoutes);
// Usar las rutas de productos bajo el prefijo '/productos'
app.use('/productos', productosRoutes);
app.use('/catalogo', catalogoRoutes);
app.use('/cafeteria', cafeteriaRoutes);
app.use('/contactos', contactosRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/carrito', carritoRoutes);
app.use('/pedidos', pedidosRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola desde mi backend con Express!');
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

module.exports = app;
