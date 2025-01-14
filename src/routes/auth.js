
const express = require("express")
const { validatorRegister, validatorLogin } = require("../validators/auth")
const { registerCtrl, loginCtrl } = require("../controllers/auth")

const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")
// const User = require("./models/User")
const router = express.Router()

// Rutas de autenticación
router.post("/register", validatorRegister, registerCtrl)
router.post("/login", validatorLogin, loginCtrl)

module.exports = router