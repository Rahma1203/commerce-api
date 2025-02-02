const mongoose = require("mongoose");

const Comercio = mongoose.model("Comercio", new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        cif: { type: String, required: true, unique: true },
        direccion: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        tel: { type: String, required: true },
        idPagina: { type: Number, required: true },
        archivado: { type: Boolean, default: false },
        webPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaginaWeb', default: null } // Relación 1:1 con la tabla PaginaWeb (de esta forma se puede vincular con el id de la página web)
        

        
        
    }
));

module.exports = Comercio;