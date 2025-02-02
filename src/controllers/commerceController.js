const Commerce = require("../models/Commerce");
const {tokenCommerce} = require("../utils/handleJwt");

/**
 * Obtener la lista de comercios, opcionalmente ordenados por CIF ascendentemente.
 * Si se proporciona el parámetro `sort`, ordenará los resultados por CIF.
 */
exports.getAllCommerces = async (req, res) => {
    try {
        const { sort } = req.query;
        const { role } = req.user;
        let commerces; 

        if (role !=="admin") return res.status(403).json({ message: "No tienes permiso para obtener comercios." }); //Solo el admin puede obtener los comercios

        if (sort === "cif") commerces = await Commerce.find().sort({ cif: 1 }); // Orden ascendente por CIF.
        else commerces = await Commerce.find(); // Sin orden específico.

    


        return res.status(200).json(commerces);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

// Obtener un comercio por su CIF.
exports.getCommerceByCIF = async (req, res) => {
    try {
        const { cif } = req.params;
        
        const { role } = req.user;
        if (role !=="admin") return res.status(403).json({ message: "No tienes permiso para obtener comercios." }); //Solo el admin puede obtener los comercios
        
        const commerce = await Commerce.findOne({ cif });
        if (!commerce) return res.status(404).json({ message: "Comercio no encontrado." });
          
        const commerceToken = tokenCommerce({ cif: commerce.cif });

        
        return res.status(200).json({
            commerce: commerce,
            token: commerceToken // El token generado para el comercio
        })

        
    } catch (error) {
        console.error(error);           
        return res.status(500).json({ message: error.message });
    }
};

// Crear comercio por un admin del sitio.
exports.createCommerce = async (req, res) => {
    try {

        const { role } = req.user;
        if (role !=="admin") return res.status(403).json({ message: "No tienes permiso para crear comercios." });

        const { nombre, cif, direccion, email, tel, idPagina } = req.body;
        // Verificar si el CIF ya existe
        const existingCommerce = await Commerce.findOne({ cif });
        if (existingCommerce) {
        return res.status(400).json({ message: "El CIF ya existe." });
         }

        const newCommerce = new Commerce({
            nombre,
            cif,
            direccion,
            email,
            tel,
            idPagina,
            
        });
        const saved = await newCommerce.save();
        
        const commerceToken = tokenCommerce({ cif: saved.cif });

        
        return res.status(200).json({
            message: "Comercio creado con éxito",
            commerce: newCommerce,
            token: commerceToken // El token generado para el comercio
        });

        
    } catch (error) {
        // Error de duplicado de clave única.
        console.error("Error al crear comercio:", error);
        res.status(500).json({ message: "Error al crear comercio.", error });
    }
};

// Modificar un comercio a partir de su CIF.
 
exports.updateCommerce = async (req, res) => {
    try {
        const { role } = req.user;
        const { cif } = req.params;
        if (role !=="admin") return res.status(403).json({ message: "No tienes permiso para modificar comercios." });
        const updates = req.body;

        const updatedCommerce = await Commerce.findOneAndUpdate({ cif }, updates, { new: true });

        if (!updatedCommerce) return res.status(404).json({ message: "Comercio no encontrado." });

        return res.status(200).json({
            message: "Comercio actualizado con éxito", 
            commerce: updatedCommerce
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Borrar un comercio a partir de su CIF, permitiendo borrado lógico o físico.
exports.deleteCommerce = async (req, res) => {
    try {
        const { cif } = req.params;
        const { tipo } = req.query; // El tipo de borrado puede ser "logico" o "fisico".
        const { role } = req.user;
        if (role !=="admin") return res.status(403).json({ message: "No tienes permiso para eliminar comercios." });

        if (tipo === "logico") {
            const comercio = await Commerce.findOneAndUpdate(
                { cif },
                { archivado: true },
                { new: true }
            );

            if (!comercio) return res.status(404).json({ message: "Comercio no encontrado." });

            return res.status(200).json({ message: "Borrado lógico exitoso.", comercio });
        } else if (tipo === "fisico") {
            const comercio = await Commerce.findOneAndDelete({ cif });

            if (!comercio) return res.status(404).json({ message: "Comercio no encontrado." });

            return res.status(200).json({ message: "Borrado físico exitoso.", comercio });
        } else return res.status(400).json({ message: "Parámetro 'tipo' inválido. Usa 'logico' o 'fisico'." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



