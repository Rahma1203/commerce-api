const express = require("express");
const { query } = require("express-validator");
const commerceController = require("../controllers/commerceController");
const { commerceValidators, cifValidator, sortValidator } = require("../validators/commerceValidators");

const router = express.Router();

/**
 * Ruta para obtener todos los comercios, opcionalmente ordenados por CIF
 * URL: ?sort=cif
 */
router.get("/", sortValidator, commerceController.getAllCommerces);

/**
 * Ruta para obtener un comercio por su CIF.
 * URL: /:cif
 */
router.get("/:cif", cifValidator, commerceController.getCommerceByCIF);

/**
 * Ruta para crear un nuevo comercio.
 * URL: 
 */
router.post("/", commerceValidators, commerceController.createCommerce);

/**
 * Ruta para actualizar un comercio por su CIF.
 * URL: /:cif
 */
router.put("/:cif", [...cifValidator, ...commerceValidators], commerceController.updateCommerce);

/**
 * Ruta para borrar un comercio por su CIF.
 * URL: /:cif?tipo=logico/fisico
 */
router.delete("/:cif", [
    ...cifValidator,
    query("tipo").isIn(["logico", "fisico"]).withMessage("El tipo debe ser 'logico' o 'fisico'.")
], commerceController.deleteCommerce);

module.exports = router;