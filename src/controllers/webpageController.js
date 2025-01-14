const PaginaWeb = require("../models/WebPage");

require('dotenv').config();


// Obtener una página web por ID.
exports.getWebPageById = async (req, res) => {
    try {
        const pagina = await PaginaWeb.findById(req.params.id);
        if (!pagina || pagina.archivado) return res.status(404).json({ message: `Página con ID "${req.params.id}" no encontrada o archivada.` });
        
        return res.json(pagina);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener la página." });
    }
};

// Crear una nueva página web.
exports.createWebPage = async (req, res) => {
    try {
        const nuevaPagina = new PaginaWeb(req.body);
        await nuevaPagina.save();
        return res.status(201).json(nuevaPagina);
    } catch (error) {
        return res.status(400).json({ message: "Error al crear la página.", error });
    }
};


exports.updateWebPage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imagenes: nuevasImagenes, ...camposActualizados } = req.body;

        // Buscar la página web.
        const paginaActual = await PaginaWeb.findById(id);
        if (!paginaActual) {
            return res.status(404).json({ message: "Página no encontrada." });
        }

        // Combinar las imágenes existentes con las nuevas.
        if (nuevasImagenes && nuevasImagenes.length > 0) {
            paginaActual.imagenes = [...paginaActual.imagenes, ...nuevasImagenes];
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
        const paginaArchivada = await PaginaWeb.findByIdAndUpdate(req.params.id, { archivado: true }, { new: true });
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
        const paginaEliminada = await PaginaWeb.findByIdAndDelete(req.params.id);
        if (!paginaEliminada) return res.status(404).json({ message: "Página no encontrada." });
    
        return res.json({ message: "Página eliminada exitosamente." });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la página.", error });
    }
};

  
exports.createReview = async (req, res) => {
    try {
        const { id } = req.params; // ID de la página web
        const { puntuacion, resenas } = req.body.resenas; // Datos enviados desde el cliente
        console.log("Cuerpo recibido:", req.body);

        // Buscar la página web por su ID.
        const paginaActual = await PaginaWeb.findById(id);
        if (!paginaActual) {
            return res.status(404).json({ message: "Página no encontrada." });
        }
      
        // Validar puntuación.
        if (puntuacion < 0 || puntuacion > 5) {
            return res.status(400).json({ message: "La puntuación debe estar entre 0 y 5." });
        }
          console.log("Puntuación recibida:", puntuacion);
          console.log(paginaActual.resenas.puntuacion, paginaActual.resenas.numeroPuntuaciones);
        
        // Agregar la nueva reseña
        if (resenas) {
            // Añadir las nuevas reseñas al array de reseñas
            paginaActual.resenas.resenas = paginaActual.resenas.resenas.concat(resenas);
        }
        
        // Actualizar la puntuación global.
        if (puntuacion) {
            // Calcular el total de puntuaciones y el nuevo promedio
            const totalPuntuaciones = paginaActual.resenas.resenas.reduce((acc, current) => acc + current.puntuacion, 0) || 0;
            const puntuacionPromedio = (totalPuntuaciones + puntuacion) / (paginaActual.resenas.resenas.length + 1);

            // Actualizar el número de puntuaciones y el promedio de la puntuación
            paginaActual.resenas.numeroPuntuaciones++;
            paginaActual.resenas.puntuacion = puntuacionPromedio; // Guardar el promedio actualizado
        }

        console.log("Resenas recibidas:", paginaActual.resenas.resenas);

        // Guardar los cambios en la base de datos.
        const paginaActualizada = await paginaActual.save();
        console.log("Página actualizada:", paginaActualizada);
     
        return res.json({
            message: "Reseña añadida con éxito.",
            pagina: paginaActualizada,
        });
    } catch (error) {
        console.error("Error al añadir la reseña:", error);
        return res.status(500).json({
            message: "Error al añadir la reseña.",
            error,
        });
    }
};





exports.uploadImage = async (req, res) => {
    try {
        console.log("Inicio de uploadImage");
        const id = req.params.id;

        // Construir la URL pública utilizando la variable de entorno.
        const imageURL = `${process.env.PUBLIC_URL}/${req.file.filename}`;
        console.log("URL de la imagen generada:", imageURL);

        // Usar findOneAndUpdate para actualizar el array directamente.
        const updatedWebPage = await PaginaWeb.findOneAndUpdate(
            { _id: id },
            { $push: { imagenes: imageURL } }, // Agregar al array de imágenes.
            { new: true } // Retornar el documento actualizado.
        );

        // Validar si la página fue encontrada.
        if (!updatedWebPage) {
            console.log("Página web no encontrada.");
            return res.status(404).json({ message: "Página web no encontrada." });
        }

        console.log("Imagen agregada al array de imágenes:", updatedWebPage.imagenes);
        console.log("Cambios guardados en la base de datos.");

        return res.status(200).json({ 
            message: "Imagen subida con éxito.", 
            data: updatedWebPage 
        });
    } catch (error) {
        console.error("Error en uploadImage:", error);
        return res.status(500).json({ message: "Error al subir la imagen." });
    }
};
