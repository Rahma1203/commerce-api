const PaginaWeb = require("../models/WebPage");
const UsersModel = require("../models/User")
const Commerce = require("../models/Commerce");

require('dotenv').config();


// Obtener una página web por ID.
exports.getWebPageById = async (req, res) => {
    try {
        const { cif } = req.user;
        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }

        // Obtener comercio por CIF
        const comercio = await Commerce.findOne({ cif });
        if (!comercio) return res.status(404).json({ message: "Comercio no encontrado." });

        // Verificar si el comercio tiene un ID de página web
        if (!comercio.webPageId) {
            return res.status(404).json({ message: "Este comercio no tiene una página web asociada." });
        }

        // Obtener la página web usando el ID de la página web asociada al comercio
        const pagina = await PaginaWeb.findById(comercio.webPageId);
        if (!pagina) {
            return res.status(404).json({ message: "Página web no encontrada." });
        }

        return res.json(pagina);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener la página." });
    }
};



// Crear una nueva página web.
exports.createWebPage = async (req, res) => {
    try {
        // Verifica que req.user esté definido y que cif esté presente
        const { cif } = req.user;
        
        if (!cif) { 
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }

        // Verificar si el comercio existe
        const comercio = await Commerce.findOne({ cif });
        
        if (!comercio) {
            return res.status(404).json({ message: "Comercio no encontrado." });
        }

        
        // Verificar si el comercio ya tiene una página web asociada
        if (comercio.webPageId) {
            return res.status(400).json({ message: "El comercio ya tiene una página web." });
        }

        
        // Crear la nueva página web
        const nuevaPagina = new PaginaWeb(req.body);
        await nuevaPagina.save();

        // Asignar el ID de la nueva página web al comercio
        comercio.webPageId = nuevaPagina._id;
        await comercio.save();

        return res.status(201).json(nuevaPagina);
    } catch (error) {
        return res.status(400).json({ message: "Error al crear la página.", error });
    }
};



exports.updateWebPage = async (req, res) => {
    try {
        const { cif } = req.user;
        
        if (!cif) { 
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }
        const { imagenes: nuevasImagenes,resenas: nuevasResenas,textos: nuevosTextos, ...camposActualizados } = req.body;
  

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

        if(nuevasResenas && nuevasResenas.length > 0) {
            paginaActual.resenas.resenas = [...paginaActual.resenas.resenas, ...nuevasResenas];
        }

        if(nuevosTextos && nuevosTextos.length > 0) {
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
        if (!cif) { 
            return res.status(400).json({ message: "CIF no proporcionado en req.user." });
        }
        const comercio = await Commerce.findOne({ cif });
        // Verificar si el comercio tiene un ID de página web
        if (!comercio.webPageId) {
            return res.status(404).json({ message: "Este comercio no tiene una página web asociada." });
        }
        const paginaEliminada = await PaginaWeb.findByIdAndDelete(comercio.webPageId);
        if (!paginaEliminada) return res.status(404).json({ message: "Página no encontrada." });

        // Actualizar el comercio para quitar la referencia a la página web
        comercio.webPageId = null;
        await comercio.save();
    
        return res.json({ message: "Página eliminada exitosamente." });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la página.", error });
    }
};

  
exports.createReview = async (req, res) => {
    try {
        const { id } = req.params; // ID de la página web
        const { puntuacion, resenas } = req.body.resenas; // Datos enviados desde el cliente
        

        // Buscar la página web por su ID.
        const paginaActual = await PaginaWeb.findById(id);
        if (!paginaActual) {
            return res.status(404).json({ message: "Página no encontrada." });
        }
      
        // Validar puntuación.
        if (puntuacion < 0 || puntuacion > 5) {
            return res.status(400).json({ message: "La puntuación debe estar entre 0 y 5." });
        }
          
        
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
            paginaActual.resenas.puntuacion = parseFloat(puntuacionPromedio.toFixed(2)); // Guardar el promedio actualizado
        }

        

        // Guardar los cambios en la base de datos.
        const paginaActualizada = await paginaActual.save();
       
     
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
        const { interests, allowsReceivingOffers } = req.query;

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

        // Crear el filtro base
        const filter = {
            interests: { $in: [pagina.actividad] }, // Buscar interesados con la actividad del comercio
            allowsReceivingOffers: true,
        };

        // Filtrar por intereses 
        if (interests) {
            filter.interests = { $regex: interests, $options: 'i' }; 
        }

        // Buscar usuarios interesados
        const interesados = await UsersModel.find(filter).select("name email");


        return res.json({
            message: "Usuarios interesados obtenidos con éxito.",
            usuarios: interesados
        });

    } catch (error) {
        console.error("Error al obtener usuarios interesados:", error);
        return res.status(500).json({ message: "Error al obtener usuarios interesados.", error });
    }
};

