const mongoose = require("mongoose");

const Comercio = mongoose.model("Comercio", new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        cif: { type: String, required: true, unique: true },
        direccion: { type: String, required: true },
        email: { type: String, required: true },
        tel: { type: String, required: true },
        idPagina: { type: Number, required: true }
    }
));

module.exports = Comercio;