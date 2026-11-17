const request = require('supertest');
const app = require('../src/index');

describe('API /productos', () => {
  test('GET /productos devuelve la lista de productos', async () => {
    const res = await request(app).get('/productos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /productos/:id devuelve 404 si no existe', async () => {
    const res = await request(app).get('/productos/999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /productos crea un producto nuevo', async () => {
    const res = await request(app)
      .post('/productos')
      .send({ nombre: 'Audífonos', precio: 30 });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Audífonos');
  });

  test('POST /productos sin nombre devuelve 400', async () => {
    const res = await request(app).post('/productos').send({ precio: 10 });
    expect(res.statusCode).toBe(400);
  });
});
