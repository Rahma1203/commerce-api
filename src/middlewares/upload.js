const multer = require("multer");

const storage = multer.diskStorage({
    
    destination: function (req, file, callback) { // Pasan argumentos automáticamente.
        callback(null, __dirname + "/../storage") // Error y destination
    },
    filename: function (req, file, callback) { 
        // Tienen extensión jpg, pdf, mp4.
        callback(null, `file-${Date.now()}.${file.originalname.split(".").pop()}`)
    }
})

// Exportamos el middleware entre la ruta y el controlador.
module.exports = multer({ storage });