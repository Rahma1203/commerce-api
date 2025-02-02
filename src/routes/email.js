const express = require('express');
const { send } = require('../mail/send');
const { validatorMail } = require('../validators/ValidatorMail');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Ruta para enviar el correo, con la validación previa
router.post('/send',authMiddleware, validatorMail, send);

module.exports = router;
