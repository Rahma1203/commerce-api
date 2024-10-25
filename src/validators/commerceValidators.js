const { body, param, query } = require("express-validator");

// Validadores para crear o actualizar un comercio.
exports.commerceValidators = [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("cif").isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres"),
    body("address").optional().isString().withMessage("La dirección debe ser una cadena de texto")
];

// Validador para el CIF en la URL.
exports.cifValidator = [
    param("cif").isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres")
];

// Validador para la ordenación de comercios por CIF en la URL.
exports.sortValidator = query("sort")
    .optional()
    .isIn(["cif"])
    .withMessage("El orden debe ser por 'cif'.");