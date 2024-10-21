const { body, param } = require("express-validator");

// Validación para crear y actualizar una página web.
exports.validateWebPage = [
    body("ciudad").notEmpty().withMessage("La ciudad es obligatoria"),
    body("actividad").notEmpty().withMessage("La actividad es obligatoria"),
    body("titulo").notEmpty().withMessage("El título es obligatorio"),
    body("resumen").notEmpty().withMessage("El resumen es obligatorio"),
    body("textos").isArray().withMessage("Los textos deben ser un array").notEmpty().withMessage("Los textos son obligatorios"),
    body("imagenes").optional().isArray().withMessage("Las imágenes deben ser un array"),
    body("resenas.puntuacion").isFloat({ min: 0, max: 5 }).optional().withMessage("La puntuación debe ser un número entre 0 y 5"),
    body("resenas.numeroPuntuaciones").isInt().optional().withMessage("El número de puntuaciones debe ser un número entero"),
    body("resenas.resenas").optional().isArray().withMessage("Las reseñas deben ser un array")
];

// Validación para obtener una página web por ID.
exports.validateWebPageId = [
    param("id").isMongoId().withMessage("ID de página no válido")
];

// Validación para la subida de imágenes.
exports.validateImageUpload = (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Imagen no proporcionada." });
    next();
};