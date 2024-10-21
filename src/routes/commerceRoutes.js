const express = require("express");
const commerceController = require("../controllers/commerceController");
const { commerceValidators, cifValidator, sortValidator } = require("../validators/commerceValidators");

const router = express.Router();

/**
 * Ruta para obtener todos los comercios, opcionalmente ordenados por CIF
 * URL: /commerces?sort=cif
 */
router.get("/commerces", sortValidator, commerceController.getAllCommerces);

/**
 * Ruta para obtener un comercio por su CIF.
 * URL: /commerces/:cif
 */
router.get("/commerces/:cif", cifValidator, commerceController.getCommerceByCIF);

/**
 * Ruta para crear un nuevo comercio.
 * URL: /commerces
 */
router.post("/commerces", commerceValidators, commerceController.createCommerce);

/**
 * Ruta para actualizar un comercio por su CIF.
 * URL: /commerces/:cif
 */
router.put("/commerces/:cif", [...cifValidator, ...commerceValidators], commerceController.updateCommerce);

/**
 * Ruta para borrar un comercio por su CIF.
 * URL: /commerces/:cif?tipo=logico/fisico
 */
router.delete("/commerces/:cif", [
    ...cifValidator,
    query("tipo").isIn(["logico", "fisico"]).withMessage("El tipo debe ser 'logico' o 'fisico'.")
], commerceController.deleteCommerce);

module.exports = router;