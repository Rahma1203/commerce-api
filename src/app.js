require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Constants.
const PORT = process.env.PORT || 3000;

// Middlewares.
// Le decimos a la app de express() que use express.json() para procesar JSON.
app.use(express.json());


// Conexión a MongoDB.
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Conectado a MongoDB."))
.catch(err => {
    console.error("Error al conectar a MongoDB:", err.message);
    process.exit(1); // Termina el proceso del servidor de la API si no se puede conectar a la base de datos.
});

// ROUTES.
app.use(require("./routes/commerceRoutes.js"));

// LISTEN.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});