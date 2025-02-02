const express = require("express");
const { query } = require("express-validator");
const commerceController = require("../controllers/commerceController");
const { commerceValidators, cifValidator, sortValidator } = require("../validators/commerceValidators");
const { authMiddleware } = require("../middlewares/auth")

const router = express.Router();


/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Comercios
 *     summary: Obtener todos los comercios
 *     description: Devuelve todos los comercios registrados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comercios
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get("/", authMiddleware, sortValidator, commerceController.getAllCommerces);

/**
 * @openapi
 * /{cif}:
 *   get:
 *     tags:
 *       - Comercios
 *     summary: Obtener un comercio por CIF
 *     description: Devuelve los detalles de un comercio utilizando su CIF.
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comercio encontrado
 *       400:
 *         description: CIF no válido
 *       404:
 *         description: Comercio no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get("/:cif", authMiddleware, cifValidator, commerceController.getCommerceByCIF);

/**
 * @openapi
 * /:
 *   post:
 *     tags:
 *       - Comercios
 *     summary: Crear un nuevo comercio
 *     description: Permite registrar un nuevo comercio.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comercio'
 *     responses:
 *       201:
 *         description: Comercio creado exitosamente
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post("/", authMiddleware, commerceValidators, commerceController.createCommerce);

/**
 * @openapi
 * /update/{cif}:
 *   put:
 *     tags:
 *       - Comercios
 *     summary: Actualizar un comercio
 *     description: Permite actualizar los detalles de un comercio existente usando su CIF.
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comercio'
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente
 *       400:
 *         description: Datos no válidos
 *       404:
 *         description: Comercio no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.put("/update/:cif", authMiddleware, [...cifValidator, ...commerceValidators], commerceController.updateCommerce);

/**
 * @openapi
 * /{cif}:
 *   delete:
 *     tags:
 *       - Comercios
 *     summary: Eliminar un comercio
 *     description: Elimina un comercio utilizando su CIF.
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio
 *       - in: query
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *         description: El tipo de eliminación (logico o fisico)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente
 *       400:
 *         description: CIF no válido o tipo incorrecto
 *       404:
 *         description: Comercio no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.delete("/:cif", authMiddleware, [
    ...cifValidator,
    query("tipo").isIn(["logico", "fisico"]).withMessage("El tipo debe ser 'logico' o 'fisico'.")
], commerceController.deleteCommerce);


module.exports = router;