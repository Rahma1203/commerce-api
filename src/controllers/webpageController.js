const PaginaWeb = require("../models/WebPage");
const UsersModel = require("../models/User")
const Commerce = require("../models/Commerce");

require('dotenv').config();



//Ver página por ciudad y actividad
exports.getWebPagesByCityAndActivity = async (req, res) => {
    try {
        const { ciudad, actividad } = req.params;
        const paginas = await PaginaWeb.find({ ciudad: ciudad, actividad: actividad });
        if (paginas.length === 0) {
            return res.status(404).json({ message: `No se encontraron páginas web en la ciudad: ${ciudad} y la actividad: ${actividad}.` }); // En el caso de que no se encuentre
        }
        return res.json(paginas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener la página." });
    }
};

// Ver pagina web por ciudad  (usuarios)

exports.getWebPagesByCity = async (req, res) => {
    try {

        const { ciudad } = req.params;

        const paginas = await PaginaWeb.find({ ciudad: ciudad });


        if (paginas.length === 0) {
            return res.status(404).json({ message: `No se encontraron páginas web en la ciudad: ${ciudad}.` });
        }


        return res.json(paginas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener la página." });
    }
};

// Obtener una página web por ID.
exports.getWebPageById = async (req, res) => {
    try {
        // Obtener ID de la pagina web
        const { id } = req.params;

        const pagina = await PaginaWeb.findById(id);

        if (!pagina) {
            return res.status(404).json({ message: "Página web no encontrada." });
        }

        return res.json(pagina);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener la página." });
    }
};

// Vewr todas las paginas web
exports.getAllWebPages = async (req, res) => {
    try {
        const paginas = await PaginaWeb.find();
        return res.json(paginas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las páginas." });
    }
};

// Crear una nueva página web.
exports.createWebPage = async (req, res) => {
    try {
       
        const { cif } = req.user;
        const { ciudad, actividad, titulo, resumen, textos, imagenes } = req.body;

        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }

        // Verificar si el comercio existe en la base de datos
        const comercio = await Commerce.findOne({ cif });
        if (!comercio) {
            return res.status(404).json({ message: "Comercio no encontrado." });
        }

        // Verificar si el comercio ya tiene una página web asociada
        if (comercio.webPageId) {
            return res.status(400).json({ message: "El comercio ya tiene una página web." });
        }

        // Crear una nueva página web con valores predeterminados para las reseñas
    
        const nuevaPagina = new PaginaWeb({
            comercioId: comercio._id,
            ciudad,
            actividad,
            titulo,
            resumen,
            textos,
            imagenes,
            resenas: {
                puntuacion: 0,
                numeroPuntuaciones: 0,
                resenas: []
            }

        });


        // Guardar la nueva página web en la base de datos
        await nuevaPagina.save();

        // Asociar la página web creada al comercio correspondiente
        comercio.webPageId = nuevaPagina._id;
        await comercio.save();

        // Devolver una respuesta con la información de la página web creada
        return res.status(201).json({
            message: "Página web creada correctamente.",
            pagina: nuevaPagina
        });

    } catch (error) {
        console.error("Error al crear la página:", error);
        return res.status(500).json({
            message: "Error al crear la página web.",
            error: error.message
        });
    }
};




exports.updateWebPage = async (req, res) => {
    try {
        const { cif } = req.user;

        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }
        const { imagenes: nuevasImagenes, resenas: nuevasResenas, textos: nuevosTextos, ...camposActualizados } = req.body;


        // Obtener comercio por CIF
        const comercio = await Commerce.findOne({ cif });
        if (!comercio) return res.status(404).json({ message: "Comercio no encontrado." });

        // Verificar si el comercio tiene un ID de página web
        if (!comercio.webPageId) {
            return res.status(404).json({ message: "Este comercio no tiene una página web asociada." });
        }

        // Obtener la página web usando el ID de la página web asociada al comercio
        const paginaActual = await PaginaWeb.findById(comercio.webPageId);
        if (!paginaActual) {
            return res.status(404).json({ message: "Página no encontrada." });
        }

        // Combinar las imágenes existentes con las nuevas.
        if (nuevasImagenes && nuevasImagenes.length > 0) {
            paginaActual.imagenes = [...paginaActual.imagenes, ...nuevasImagenes];
        }

        if (nuevasResenas && nuevasResenas.length > 0) {
            paginaActual.resenas.resenas = [...paginaActual.resenas.resenas, ...nuevasResenas];
        }

        if (nuevosTextos && nuevosTextos.length > 0) {
            paginaActual.textos = [...paginaActual.textos, ...nuevosTextos];
        }

        // Actualizar otros campos de la página.
        Object.assign(paginaActual, camposActualizados);

        // Guardar los cambios.
        const paginaActualizada = await paginaActual.save();

        return res.json({
            message: "Página actualizada con éxito.",
            pagina: paginaActualizada,
        });
    } catch (error) {
        console.error("Error al actualizar la página:", error);
        return res.status(500).json({
            message: "Error al actualizar la página.",
            error,
        });
    }
};


// Archivar una página web (borrado lógico).
exports.archiveWebPage = async (req, res) => {
    try {
        const { cif } = req.user;
        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }
        const comercio = await Commerce.findOne({ cif });
        // Verificar si el comercio tiene un ID de página web
        if (!comercio.webPageId) {
            return res.status(404).json({ message: "Este comercio no tiene una página web asociada." });
        }
        const paginaArchivada = await PaginaWeb.findByIdAndUpdate(comercio.webPageId, { archivado: true }, { new: true });
        if (!paginaArchivada) return res.status(404).json({ message: "Página no encontrada." });

        return res.json({ message: "Página archivada exitosamente.", paginaArchivada });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al archivar la página.", error });
    }
};

// Eliminar una página web (borrado físico).
exports.deleteWebPage = async (req, res) => {
    try {
        const { cif } = req.user;

        // Verificar si el comercio existe
        const comercio = await Commerce.findOne({ cif });
        if (!comercio) {
            return res.status(404).json({ message: "Comercio no encontrado." });
        }

        // Verificar si el comercio tiene una página web
        if (!comercio.webPageId) {
            return res.status(400).json({ message: "El comercio no tiene una página web asociada." });
        }

        // Eliminar la página web
        const pagina = await PaginaWeb.findByIdAndDelete(comercio.webPageId);
        if (!pagina) {
            return res.status(404).json({ message: "Página web no encontrada." });
        }

        // Eliminar la referencia de la página web del comercio
        comercio.webPageId = null;
        await comercio.save();

        return res.status(200).json({ message: "Página web eliminada correctamente." });

    } catch (error) {
        console.error("Error al eliminar la página:", error);
        return res.status(500).json({
            message: "Error al eliminar la página web.",
            error: error.message
        });
    }
};


exports.createReview = async (req, res) => {
    try {
        const { id } = req.params; // ID de la página web
        const { puntuacion, comentario } = req.body; // Datos enviados desde el cliente
        const user = req.user._id; // ID del usuario autenticado

        // Buscar la página web por su ID
        const paginaActual = await PaginaWeb.findById(id);
        if (!paginaActual) {
            return res.status(404).json({ message: "Página no encontrada." });
        }

        // Verificar que no sea un administrador
        if (req.user.rol === "admin") {
            return res.status(400).json({ message: "Los administradores no pueden poner reseñas." });
        }

        // Validar puntuación
        if (puntuacion < 0 || puntuacion > 5) {
            return res.status(400).json({ message: "La puntuación debe estar entre 0 y 5." });
        }

        // Verificar si el usuario ya ha dejado una reseña en esta página
        const reseñaExistente = paginaActual.resenas.resenas.some(resena => resena.user.toString() === user.toString());
        if (reseñaExistente) {
            return res.status(400).json({ message: "Ya has dejado una reseña en esta página." });
        }

        // Crear una nueva reseña
        const nuevaResena = {
            user,
            puntuacion,
            comentario,
        };

        // Añadir la nueva reseña al array de reseñas de la página web
        paginaActual.resenas.resenas.push(nuevaResena);

        // Calcular el nuevo promedio de puntuación
        const totalPuntuaciones = paginaActual.resenas.resenas.reduce(
            (acc, current) => acc + parseFloat(current.puntuacion), // Convertir cada puntuación a número para sumarla
            0 // Valor inicial del acumulador
        );
        const nuevoPromedio = totalPuntuaciones / paginaActual.resenas.resenas.length;

        // Actualizar los campos de resumen
        paginaActual.resenas.numeroPuntuaciones = paginaActual.resenas.resenas.length;
        paginaActual.resenas.puntuacion = parseFloat(nuevoPromedio.toFixed(2));

        // Guardar los cambios en la base de datos
        const paginaActualizada = await paginaActual.save();

        return res.json({
            message: "Reseña añadida con éxito.",
            pagina: paginaActualizada,
        });
    } catch (error) {
        console.error("Error al añadir la reseña:", error);
        return res.status(500).json({
            message: "Error al añadir la reseña.",
            error: error.message,
        });
    }
};






exports.uploadImage = async (req, res) => {
    try {
        const { cif } = req.user;
        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }
        const comercio = await Commerce.findOne({ cif });



        // Construir la URL pública utilizando la variable de entorno.
        const imageURL = `${process.env.PUBLIC_URL}/${req.file.filename}`;


        // Usar findOneAndUpdate para actualizar el array directamente.
        const updatedWebPage = await PaginaWeb.findOneAndUpdate(
            { _id: comercio.webPageId },
            { $push: { imagenes: imageURL } }, // Agregar al array de imágenes.
            { new: true } // Retornar el documento actualizado.
        );

        // Validar si la página fue encontrada.
        if (!updatedWebPage) {
            console.log("Página web no encontrada.");
            return res.status(404).json({ message: "Página web no encontrada." });
        }



        return res.status(200).json({
            message: "Imagen subida con éxito.",
            data: updatedWebPage
        });
    } catch (error) {
        console.error("Error en uploadImage:", error);
        return res.status(500).json({ message: "Error al subir la imagen." });
    }
};


//Subir textos
exports.updateText = async (req, res) => {
    try {
        const { cif } = req.user;
        const { textos } = req.body;

        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }

        const comercio = await Commerce.findOne({ cif });

        if (!comercio) {
            return res.status(404).json({ message: "Comercio no encontrado." });
        }



        // Usar findOneAndUpdate para actualizar el array directamente.
        const updatedWebPage = await PaginaWeb.findOneAndUpdate(
            { _id: comercio.webPageId },
            { $push: { textos: { $each: textos } } }, // Agregar al array de textos.
            { new: true } // Retornar el documento actualizado.
        );

        // Validar si la página fue encontrada.
        if (!updatedWebPage) {
            console.log("Página web no encontrada.");
            return res.status(404).json({ message: "Página web no encontrada." });
        };

        return res.status(200).json({
            message: "Texto subido con éxito.",
            data: updatedWebPage
        });
    } catch (error) {
        console.error("Error en uploadText:", error);
        return res.status(500).json({ message: "Error al subir el texto." });
    }

};



// El comercio  podrá ver los emails de los usuarios interesados en su actividad 
exports.getInterested = async (req, res) => {
    try {
        const { cif } = req.user;
        const { interests, permiteRecibirOfertas } = req.query;

        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado." });
        }

        // Obtener el comercio por CIF
        const comercio = await Commerce.findOne({ cif });
        if (!comercio) {
            return res.status(404).json({ message: "Comercio no encontrado." });
        }

        // Buscar la página web asociada al comercio
        const pagina = await PaginaWeb.findById(comercio.webPageId);
        if (!pagina) {
            return res.status(404).json({ message: "Página web no encontrada para este comercio." });
        }

        console.log(pagina);

        // Crear el filtro base
        const filter = {
            interests: { $in: [pagina.actividad] }, // Buscar interesados con la actividad del comercio
            permiteRecibirOfertas: true,

        };
        console.log(filter);
     
        // Buscar usuarios interesados
        const interesados = await UsersModel.find(filter).select("name email");

        console.log(interesados);

        return res.json({
            message: "Usuarios interesados obtenidos con éxito.",
            usuarios: interesados
        });

    } catch (error) {
        console.error("Error al obtener usuarios interesados:", error);
        return res.status(500).json({ message: "Error al obtener usuarios interesados.", error });
    }
};