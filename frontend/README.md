# Frontend de Café Aurora

Aplicación Angular que consume la API del backend (`../trabajo-ia`).

## Requisitos

- Node.js 22+
- El backend (`trabajo-ia`) corriendo en `http://localhost:3000` (ver su README para configurar PostgreSQL y la API key de Claude).

## Configuración

La URL del backend se define en `src/environments/environment.ts` (`apiUrl`). Por defecto apunta a `http://localhost:3000`.

## Desarrollo

```bash
npm install
npm start
```

Abre `http://localhost:4200`.

## Build de producción

```bash
npm run build
```

Los archivos quedan en `dist/frontend`.

## Estructura

- `src/app/core/models` y `src/app/core/services` — tipos y servicios HTTP para cada endpoint del backend (`productos`, `catalogo`, `cafeteria`, `contactos`, `chatbot`, `usuarios`, `carrito`, `favoritos`, `pedidos`).
- `src/app/core/interceptors/auth-interceptor.ts` — agrega el token JWT a cada request hacia el backend.
- `src/app/core/guards/auth-guard.ts` — protege `/carrito`, `/favoritos` y `/cuenta`, redirige a `/login` si no hay sesión.
- `src/app/shared` — navbar (con iconos de favoritos/cuenta/carrito), footer, tarjeta de producto reutilizable y el widget flotante del chatbot.
- `src/app/pages` — Inicio, Menú, Catálogo, Nosotros, Contacto, Login, Registro, Carrito, Favoritos y Cuenta (perfil + historial de pedidos).

Todos los datos que se muestran (productos, precios, imágenes, promociones, información de la cafetería) vienen del backend/PostgreSQL — no hay datos hardcodeados en el frontend.
