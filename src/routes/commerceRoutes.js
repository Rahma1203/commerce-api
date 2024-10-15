const express = require("express");

const router = express.Router();

const commerceController = require("../controllers/commerceController");

/**
 * Ruta para obtener todos los comercios, opcionalmente ordenados por CIF
 * URL: /commerces?sort=cif
 */
router.get("/commerces", commerceController.getAllCommerces);

/**
 * Ruta para obtener un comercio por su CIF
 * URL: /commerces/:cif
 */
router.get("/commerces/:cif", commerceController.getCommerceByCIF);

/**
 * Ruta para crear un nuevo comercio
 * URL: /commerces
 */
router.post("/commerces", commerceController.createCommerce);

/**
 * Ruta para actualizar un comercio por su CIF
 * URL: /commerces/:cif
 */
router.put("/commerces/:cif", commerceController.updateCommerce);

/**
 * Ruta para borrar un comercio por su CIF
 * URL: /commerces/:cif?tipo=logico/fisico
 */
router.delete("/commerces/:cif", commerceController.deleteCommerce);

module.exports = router;