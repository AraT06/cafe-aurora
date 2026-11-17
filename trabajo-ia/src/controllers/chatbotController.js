const Anthropic = require('@anthropic-ai/sdk');
const { anthropicApiKey, anthropicModel } = require('../config/env');
const productosModel = require('../models/productosModel');
const catalogModel = require('../models/catalogModel');
const cafeteriaModel = require('../models/cafeteriaModel');

const client = new Anthropic({ apiKey: anthropicApiKey });

const SYSTEM_PROMPT = [
  'Eres el asistente virtual de una cafetería. Respondes en español, de forma amable, cálida y concisa.',
  'Solo informas sobre el menú, precios, servicios, especialidades, horarios y ubicación de la cafetería.',
  'Usa siempre las herramientas disponibles para consultar el menú, el catálogo o los datos de la cafetería antes de responder preguntas sobre esos temas: nunca inventes productos, precios ni horarios.',
  'Si la información solicitada no aparece en los resultados de las herramientas, indica que no tienes ese dato y que el cliente contacte al local.'
].join(' ');

// Cada "tool" llama directamente a los modelos que leen la base de datos,
// para que el chatbot nunca invente productos, precios ni horarios.
const TOOLS = [
  {
    name: 'obtener_menu',
    description:
      'Obtiene el menú de productos de la cafetería (nombre, descripción, categoría, precio en bolivianos e indicador de promoción). Úsala para preguntas sobre el menú, precios o categorías.',
    input_schema: {
      type: 'object',
      properties: {
        categoria: {
          type: 'string',
          description:
            'Filtra por categoría exacta (opcional): "Clásico", "Con leche", "Especialidad", "Dulce" o "Café frío".'
        }
      }
    }
  },
  {
    name: 'obtener_informacion_cafeteria',
    description: 'Obtiene nombre, historia, dirección, teléfono, correo y horario de atención de la cafetería.',
    input_schema: { type: 'object', properties: {} }
  },
  {
    name: 'obtener_catalogo',
    description: 'Obtiene los servicios, las especialidades o la galería de imágenes publicados por la cafetería.',
    input_schema: {
      type: 'object',
      properties: {
        tipo: {
          type: 'string',
          enum: ['servicios', 'especialidades', 'galeria'],
          description: 'Tipo de catálogo a consultar.'
        }
      },
      required: ['tipo']
    }
  }
];

const ejecutarHerramienta = async (nombre, entrada) => {
  switch (nombre) {
    case 'obtener_menu': {
      const productos = await productosModel.obtenerTodos();
      return productos
        .filter((producto) => !entrada?.categoria || producto.categoria === entrada.categoria)
        .map((producto) => ({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          precio: Number(producto.precio),
          precio_original: producto.precio_original ? Number(producto.precio_original) : null,
          en_promocion: Boolean(producto.destacado)
        }));
    }
    case 'obtener_informacion_cafeteria': {
      const info = await cafeteriaModel.obtenerInformacion();
      if (!info) return { mensaje: 'Sin información registrada' };
      const { nombre: nombreCafeteria, historia, direccion, telefono, correo, horario } = info;
      return { nombre: nombreCafeteria, historia, direccion, telefono, correo, horario };
    }
    case 'obtener_catalogo': {
      return catalogModel.obtenerTodos(entrada.tipo);
    }
    default:
      throw new Error(`Herramienta desconocida: ${nombre}`);
  }
};

const MAX_ITERACIONES = 4;

const responder = async (req, res, next) => {
  try {
    const { mensaje, historial = [] } = req.body;
    if (!mensaje || typeof mensaje !== 'string') {
      return res.status(400).json({ mensaje: 'El campo mensaje es obligatorio' });
    }

    const mensajes = [
      ...historial
        .filter((item) => item && ['user', 'assistant'].includes(item.role))
        .slice(-10)
        .map(({ role, content }) => ({ role, content })),
      { role: 'user', content: mensaje }
    ];

    let respuestaFinal = '';

    for (let iteracion = 0; iteracion < MAX_ITERACIONES; iteracion += 1) {
      const response = await client.messages.create({
        model: anthropicModel,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: mensajes
      });

      respuestaFinal = response.content
        .filter((bloque) => bloque.type === 'text')
        .map((bloque) => bloque.text)
        .join('\n');

      if (response.stop_reason !== 'tool_use') {
        break;
      }

      mensajes.push({ role: 'assistant', content: response.content });

      const bloquesHerramienta = response.content.filter((bloque) => bloque.type === 'tool_use');
      const resultados = await Promise.all(
        bloquesHerramienta.map(async (bloque) => {
          try {
            const resultado = await ejecutarHerramienta(bloque.name, bloque.input);
            return { type: 'tool_result', tool_use_id: bloque.id, content: JSON.stringify(resultado) };
          } catch (error) {
            return { type: 'tool_result', tool_use_id: bloque.id, content: error.message, is_error: true };
          }
        })
      );

      mensajes.push({ role: 'user', content: resultados });
    }

    res.json({ respuesta: respuestaFinal || 'No tengo una respuesta para eso.', modelo: anthropicModel });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return res.status(503).json({ mensaje: 'El asistente no está disponible: falta configurar la API key de Claude' });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return res.status(503).json({ mensaje: 'El asistente está ocupado, intenta de nuevo en un momento' });
    }
    if (error instanceof Anthropic.APIError) {
      return res.status(502).json({ mensaje: 'El asistente no pudo procesar la solicitud' });
    }
    next(error);
  }
};

module.exports = { responder };
