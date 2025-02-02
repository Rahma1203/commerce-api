const { check } = require("express-validator")


exports.validatorRegister = [
    check("nombre").exists().notEmpty().isLength({ min: 3, max: 99 }),
    check("edad").exists().notEmpty().isNumeric(), 
    check("ciudad").exists().notEmpty().isLength({ min: 3, max: 99 }),
    check("interests").exists().notEmpty().isArray(),       
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),


]

exports.validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
   

]


