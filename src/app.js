require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/mongo");
const morganBody = require("morgan-body")
const loggerStream = require("./utils/handleLogger")
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger");
const { beyondcorp } = require("googleapis/build/src/apis/beyondcorp");


dbConnect();

const app = express();

// Constants.
const PORT = process.env.PORT || 3000;

// Middlewares.
// Le decimos a la app de express() que use express.json() para procesar JSON.
app.use(express.json());
app.use("/api", require("./routes")); //Lee routes/index.js por defecto
app.use(express.static("storage"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

morganBody(app, {
    noColors: true,
    skip: function(req, res) {
    return res.statusCode < 400
    
    },
    
    stream: loggerStream
    
    });




// LISTEN.

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}.`);
    });




module.exports = app;