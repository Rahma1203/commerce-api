const mongoose = require("mongoose");

// Esquema para las reseñas de usuarios.
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al usuario que hace la reseña
    puntuacion: { type: Number, min: 0, max: 5, required: true }, // Puntuación de la reseña
    comentario: { type: String, required: true }, // Comentario de la reseña
}, { timestamps: true }); // Timestamps para saber cuándo se creó la reseña

// Esquema para la página web del comercio.

// Exportar el modelo.
module.exports = mongoose.model("PaginaWeb", new mongoose.Schema({
    ciudad: { type: String, required: true, lowercase: true, index: true },
    actividad: { type: String, required: true, lowercase: true, index: true },
    titulo: { type: String, required: true },
    resumen: { type: String, required: true },
    textos: { type: [String], required: true },
    imagenes: { type: [String], default: [] },
    resenas: {
        puntuacion: { type: Number, required: true, default: 0 }, // Promedio de puntuaciones
        resenas: [reviewSchema], // Array de reseñas de usuarios
    },
    archivado: { type: Boolean, default: false },
    
}));