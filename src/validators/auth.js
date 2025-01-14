const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

exports.validatorRegister = [
    check("name").exists().notEmpty().isLength({ min: 3, max: 99 }),
    check("age").exists().notEmpty().isNumeric(), //Puedes aplicarle un min y max también al
    check("city").exists().notEmpty().isLength({ min: 3, max: 99 }),
    check("interests").exists().notEmpty().isArray(),       
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),

    (req, res, next) => {
        return validateResults(req, res, next)

    }

]

exports.validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)

    }

]

