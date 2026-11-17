# Backend de la cafetería

## Configuración

1. Crear una base de datos PostgreSQL llamada `cafeteria` (o levantar una con Docker: `docker run -d --name cafeteria-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cafeteria -p 5432:5432 postgres:16-alpine`).
2. Copiar `.env.example` como `.env` y ajustar las credenciales, la `ANTHROPIC_API_KEY` y el `JWT_SECRET`.
3. Inicializar tablas y datos de ejemplo:

```bash
npm run db:init
```

4. Iniciar la API:

```bash
npm run dev
```

## Autenticación

Las rutas de carrito, favoritos y pedidos requieren un token JWT. Se obtiene con `/usuarios/registro` o `/usuarios/login` y se envía como `Authorization: Bearer <token>`.

## Endpoints

- `GET /productos`
- `GET /catalogo/servicios`
- `GET /catalogo/especialidades`
- `GET /catalogo/galeria`
- `GET /cafeteria`
- `POST /contactos`
- `POST /chatbot` con `{ "mensaje": "¿Cuál es el horario?" }` (Claude API, ver abajo)
- `POST /usuarios/registro`, `POST /usuarios/login`, `GET /usuarios/me`
- `GET/POST /favoritos`, `DELETE /favoritos/:productoId`
- `GET/POST /carrito`, `PUT/DELETE /carrito/:productoId`, `POST /carrito/checkout`
- `GET /pedidos`, `GET /pedidos/:id`

Todos los datos (productos, precios, imágenes, promociones, catálogo, información de la cafetería) viven en las tablas de PostgreSQL definidas en `database/schema.sql` — nada está hardcodeado en el frontend.

## Chatbot (Claude API)

El endpoint `/chatbot` usa la API de Anthropic (`@anthropic-ai/sdk`) en vez de un modelo local, para no depender de instalar Ollama. Define `ANTHROPIC_API_KEY` en `.env` (y opcionalmente `ANTHROPIC_MODEL`, por defecto `claude-opus-5`).

El asistente usa **tool use**: declara herramientas (`obtener_menu`, `obtener_informacion_cafeteria`, `obtener_catalogo`) que llaman directamente a los modelos que leen la base de datos, así nunca inventa productos, precios ni horarios.

Sin `ANTHROPIC_API_KEY` configurada, el endpoint responde `503` con un mensaje claro en vez de fallar.
