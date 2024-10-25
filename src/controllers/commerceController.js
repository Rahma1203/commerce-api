const Commerce = require("../models/Commerce");

/**
 * Obtener la lista de comercios, opcionalmente ordenados por CIF ascendentemente.
 * Si se proporciona el parámetro `sort`, ordenará los resultados por CIF.
 */
exports.getAllCommerces = async (req, res) => {
    try {
        const { sort } = req.query;
        let commerces;

        if (sort === "cif") commerces = await Commerce.find().sort({ cif: 1 }); // Orden ascendente por CIF.
        else commerces = await Commerce.find(); // Sin orden específico.

        return res.status(200).json(commerces);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener un comercio por su CIF.
exports.getCommerceByCIF = async (req, res) => {
    try {
        const { cif } = req.params;
        const commerce = await Commerce.findOne({ cif });

        if (!commerce) return res.status(404).json({ message: "Comercio no encontrado." });

        return res.status(200).json(commerce);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Guardar un nuevo comercio.
exports.createCommerce = async (req, res) => {
    try {
        const { nombre, cif, direccion, email, tel, idPagina } = req.body;

        const newCommerce = new Commerce({
            nombre,
            cif,
            direccion,
            email,
            tel,
            idPagina
        });

        await newCommerce.save();
        return res.status(201).json(newCommerce);
    } catch (error) {
        // Error de duplicado de clave única.
        if (error.code === 11000) return res.status(400).json({ message: "El CIF ya existe." });
        else return res.status(500).json({ message: error.message });
    }
};

// Modificar un comercio a partir de su CIF.
 
exports.updateCommerce = async (req, res) => {
    try {
        const { cif } = req.params;
        const updates = req.body;

        const updatedCommerce = await Commerce.findOneAndUpdate({ cif }, updates, { new: true });

        if (!updatedCommerce) return res.status(404).json({ message: "Comercio no encontrado." });

        return res.status(200).json(updatedCommerce);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Borrar un comercio a partir de su CIF, permitiendo borrado lógico o físico.
exports.deleteCommerce = async (req, res) => {
    try {
        const { cif } = req.params;
        const { tipo } = req.query;

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