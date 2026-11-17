const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-opus-5',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-cambiar-en-produccion'
};
