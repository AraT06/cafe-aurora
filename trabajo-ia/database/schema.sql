CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(80),
  precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  imagen TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE productos ADD COLUMN IF NOT EXISTS precio_original NUMERIC(10, 2);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS destacado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS detalles_promocion JSONB;

CREATE TABLE IF NOT EXISTS servicios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  imagen TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS especialidades (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  imagen TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS informacion_cafeteria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  historia TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono VARCHAR(40),
  correo VARCHAR(160),
  horario TEXT,
  video_url TEXT,
  mapa_url TEXT
);

ALTER TABLE informacion_cafeteria ADD COLUMN IF NOT EXISTS imagen_hero TEXT;
ALTER TABLE informacion_cafeteria ADD COLUMN IF NOT EXISTS titulo_hero VARCHAR(160);
ALTER TABLE informacion_cafeteria ADD COLUMN IF NOT EXISTS subtitulo_hero VARCHAR(160);

CREATE TABLE IF NOT EXISTS galeria (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(120),
  url_imagen TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NOT NULL,
  telefono VARCHAR(40),
  mensaje TEXT NOT NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS carrito_items (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto VARCHAR(120) NOT NULL,
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0)
);

-- Menú: café clásico
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Espresso', 'Café puro y fuerte', 'Clásico', 15.00, 'https://images.pexels.com/photos/9050518/pexels-photo-9050518.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Espresso');

INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Americano', 'Espresso con agua caliente', 'Clásico', 16.00, 'https://images.pexels.com/photos/11127537/pexels-photo-11127537.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Americano');

INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Lungo', 'Espresso largo, con más agua', 'Clásico', 16.00, 'https://images.pexels.com/photos/997656/pexels-photo-997656.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Lungo');

-- Menú: con leche
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Latte', 'Espresso con mucha leche y poca espuma', 'Con leche', 18.00, 'https://images.pexels.com/photos/11136849/pexels-photo-11136849.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Latte');

INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Macchiato', 'Espresso con un toque de espuma de leche', 'Con leche', 17.00, 'https://images.pexels.com/photos/5305639/pexels-photo-5305639.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Macchiato');

INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Flat White', 'Espresso con una capa fina de espuma de leche', 'Con leche', 17.00, 'https://images.pexels.com/photos/544113/pexels-photo-544113.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Flat White');

-- Menú: especialidad
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Irish Coffee', 'Café con whisky y crema', 'Especialidad', 25.00, 'https://images.pexels.com/photos/4915835/pexels-photo-4915835.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Irish Coffee');

-- Menú: dulce
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Vienna Coffee', 'Espresso con crema batida', 'Dulce', 19.00, 'https://images.pexels.com/photos/14761085/pexels-photo-14761085.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Vienna Coffee');

-- Menú: café frío
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
SELECT 'Cold Brew', 'Café frío de extracción lenta, suave y refrescante', 'Café frío', 17.00, 'https://images.pexels.com/photos/33996378/pexels-photo-33996378.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Cold Brew');

-- Producto destacado (banner de promoción)
INSERT INTO productos (nombre, descripcion, categoria, precio, precio_original, destacado, detalles_promocion, imagen)
SELECT
  'Iced Latte de coco',
  'Espresso, leche fría, hielo y un toque tropical de coco. Suave y balanceado, ideal para los días calurosos.',
  'Café frío',
  22.00,
  28.00,
  TRUE,
  '[
    {"titulo": "3 jarabes", "subtitulo": "vainilla, caramelo, avellana"},
    {"titulo": "Con", "subtitulo": "espresso + leche fría + hielo"},
    {"titulo": "20%", "subtitulo": "de descuento"}
  ]'::jsonb,
  'https://images.pexels.com/photos/4765835/pexels-photo-4765835.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Iced Latte de coco');

INSERT INTO especialidades (nombre, descripcion, precio, imagen)
SELECT 'Capuchino de la casa', 'Espresso, leche vaporizada y arte latte', 18.00, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM especialidades WHERE nombre = 'Capuchino de la casa');

INSERT INTO especialidades (nombre, descripcion, precio, imagen)
SELECT 'Cold Brew de la casa', 'Extracción en frío durante 18 horas, suave y con notas dulces naturales', 20.00, 'https://images.pexels.com/photos/16785688/pexels-photo-16785688.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM especialidades WHERE nombre = 'Cold Brew de la casa');

INSERT INTO especialidades (nombre, descripcion, precio, imagen)
SELECT 'Chai Latte especiado', 'Té chai con canela y especias, leche vaporizada y un toque de miel', 19.00, 'https://images.pexels.com/photos/9903178/pexels-photo-9903178.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM especialidades WHERE nombre = 'Chai Latte especiado');

INSERT INTO especialidades (nombre, descripcion, precio, imagen)
SELECT 'Mocha de temporada', 'Espresso, chocolate artesanal y leche vaporizada, con crema batida', 21.00, 'https://images.pexels.com/photos/685529/pexels-photo-685529.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM especialidades WHERE nombre = 'Mocha de temporada');

INSERT INTO servicios (nombre, descripcion, imagen)
SELECT 'Café para llevar', 'Preparamos tus bebidas para que las disfrutes donde quieras.', 'https://images.pexels.com/photos/434213/pexels-photo-434213.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre = 'Café para llevar');

INSERT INTO servicios (nombre, descripcion, imagen)
SELECT 'Zona de trabajo y wifi', 'Mesas cómodas, enchufes y wifi gratuito para trabajar o estudiar con calma', 'https://images.pexels.com/photos/33456309/pexels-photo-33456309.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre = 'Zona de trabajo y wifi');

INSERT INTO servicios (nombre, descripcion, imagen)
SELECT 'Tostado artesanal', 'Tostamos nuestro propio café en pequeños lotes para asegurar frescura y sabor', 'https://images.pexels.com/photos/773958/pexels-photo-773958.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre = 'Tostado artesanal');

INSERT INTO servicios (nombre, descripcion, imagen)
SELECT 'Reservas para eventos', 'Organiza cumpleaños, reuniones o celebraciones especiales en nuestro espacio', 'https://images.pexels.com/photos/4577393/pexels-photo-4577393.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre = 'Reservas para eventos');

INSERT INTO servicios (nombre, descripcion, imagen)
SELECT 'Entrega a domicilio', 'Llevamos tu pedido favorito hasta la puerta de tu casa u oficina', 'https://images.pexels.com/photos/13456095/pexels-photo-13456095.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre = 'Entrega a domicilio');

INSERT INTO informacion_cafeteria (nombre, historia, direccion, telefono, correo, horario, video_url, imagen_hero, titulo_hero, subtitulo_hero)
SELECT
  'Café Aurora',
  'Una cafetería acogedora dedicada al café artesanal y a los encuentros especiales.',
  'Av. Principal 123',
  '+591 70000000',
  'hola@cafeaurora.com',
  'Lunes a sábado, 08:00 a 21:00',
  'https://videos.pexels.com/video-files/855391/855391-uhd_2560_1440_25fps.mp4',
  'https://images.pexels.com/photos/8605859/pexels-photo-8605859.jpeg',
  'ORDER COFFEE',
  'Welcome'
WHERE NOT EXISTS (SELECT 1 FROM informacion_cafeteria);

UPDATE informacion_cafeteria
SET
  imagen_hero = COALESCE(imagen_hero, 'https://images.pexels.com/photos/8605859/pexels-photo-8605859.jpeg'),
  titulo_hero = COALESCE(titulo_hero, 'ORDER COFFEE'),
  subtitulo_hero = COALESCE(subtitulo_hero, 'Welcome');

INSERT INTO galeria (titulo, url_imagen, descripcion)
SELECT 'Interior de la cafetería', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', 'Un espacio para compartir y disfrutar.'
WHERE NOT EXISTS (SELECT 1 FROM galeria WHERE titulo = 'Interior de la cafetería');

INSERT INTO galeria (titulo, url_imagen, descripcion)
SELECT 'Zona de trabajo', 'https://images.pexels.com/photos/33456309/pexels-photo-33456309.jpeg', 'Un rincón cómodo para trabajar o estudiar con un buen café.'
WHERE NOT EXISTS (SELECT 1 FROM galeria WHERE titulo = 'Zona de trabajo');

INSERT INTO galeria (titulo, url_imagen, descripcion)
SELECT 'Tostado artesanal', 'https://images.pexels.com/photos/773958/pexels-photo-773958.jpeg', 'Granos tostados en pequeños lotes para máxima frescura.'
WHERE NOT EXISTS (SELECT 1 FROM galeria WHERE titulo = 'Tostado artesanal');

INSERT INTO galeria (titulo, url_imagen, descripcion)
SELECT 'Celebraciones', 'https://images.pexels.com/photos/4577393/pexels-photo-4577393.jpeg', 'Mesas listas para tus eventos y celebraciones especiales.'
WHERE NOT EXISTS (SELECT 1 FROM galeria WHERE titulo = 'Celebraciones');

INSERT INTO galeria (titulo, url_imagen, descripcion)
SELECT 'Momentos compartidos', 'https://images.pexels.com/photos/5911168/pexels-photo-5911168.jpeg', 'Un lugar para disfrutar en buena compañía.'
WHERE NOT EXISTS (SELECT 1 FROM galeria WHERE titulo = 'Momentos compartidos');

INSERT INTO galeria (titulo, url_imagen, descripcion)
SELECT 'Arte latte', 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg', 'Cada taza preparada con cuidado y buen café.'
WHERE NOT EXISTS (SELECT 1 FROM galeria WHERE titulo = 'Arte latte');
