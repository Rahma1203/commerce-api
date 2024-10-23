const mongoose = require("mongoose");

// Esquema para las reseñas de usuarios.
const reviewSchema = new mongoose.Schema({
    puntuacion: { type: Number, min: 0, max: 5, required: true },
    numeroPuntuaciones: { type: Number, required: true },
    resenas: { type: [String], default: [] }
});

// Esquema para la página web del comercio.

// Exportar el modelo.
module.exports = mongoose.model("WebPage", new mongoose.Schema({
    ciudad: { type: String, required: true },
    actividad: { type: String, required: true },
    titulo: { type: String, required: true },
    resumen: { type: String, required: true },
    textos: { type: [String], required: true },
    imagenes: { type: [String], default: [] },
    resenas: reviewSchema,
    archivado: { type: Boolean, default: false }
}));;