const express = require('express');
const { responder } = require('../controllers/chatbotController');
const router = express.Router();

router.post('/', responder);

module.exports = router;
