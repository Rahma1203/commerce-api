require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/mongo");

dbConnect();

const app = express();

// Constants.
const PORT = process.env.PORT || 3000;

// Middlewares.
// Le decimos a la app de express() que use express.json() para procesar JSON.
app.use(express.json());
app.use("/api", require("./routes")); //Lee routes/index.js por defecto
app.use(express.static("storage"));

// LISTEN.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});