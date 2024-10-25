const PaginaWeb = require("../models/WebPage");

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

// Actualizar una página web por ID.
exports.updateWebPage = async (req, res) => {
    try {
        const paginaActualizada = await PaginaWeb.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!paginaActualizada) return res.status(404).json({ message: "Página no encontrada." });
        
        return res.json(paginaActualizada);
    } catch (error) {
        return res.status(400).json({ message: "Error al actualizar la página.", error });
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

// Subir una imagen al array de imágenes.
exports.uploadImage = async (req, res) => {
    try {
        const webPage = await PaginaWeb.findById();

        if (!webPage) return res.status(404).json({ message: "Página web no encontrada." });
    
        const imageURL = `/uploads/${req.file.filename}`;

        webPage.imagenes.push(imageURL); // Agregar la URL al array de imágenes.
        await webPage.save(); // Guardar los cambios en la base de datos.

        return res.status(200).json({ message: "Imagen subida con éxito.", imageURL });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al subir la imagen." });
    }
};