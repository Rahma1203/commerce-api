const express = require("express");
const { query } = require("express-validator");
const commerceController = require("../controllers/commerceController");
const { commerceValidators, cifValidator, sortValidator } = require("../validators/commerceValidators");
const { authMiddleware } = require("../middlewares/auth")

const router = express.Router();

/**
 * @swagger
 * /commerces:
 *   get:
 *     summary: Obtener todos los comercios
 *     description: Esta ruta devuelve una lista de todos los comercios en el sistema, con posibilidad de ordenarlos según el parámetro enviado.
 *     tags:
 *       - Comercios
 *     security:
 *       - bearerAuth: []  # Autenticación requerida
 *     parameters:
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           description: Parámetro opcional para ordenar la lista de comercios.
 *     responses:
 *       200:
 *         description: Lista de comercios obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commerce'
 *       401:
 *         description: No autorizado. Se requiere un token de autenticación válido.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", authMiddleware, sortValidator, commerceController.getAllCommerces);


/**
 * @openapi
 * /commerces/{cif}:
 *   get:
 *     summary: Obtener un comercio por CIF
 *     tags:
 *       - Comercios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del comercio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comercio'
 *       404:
 *         description: Comercio no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:cif", authMiddleware, cifValidator, commerceController.getCommerceByCIF);

/**
 * @openapi
 * /commerces:
 *   post:
 *     summary: Crear un nuevo comercio
 *     tags:
 *       - Comercios
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comercio'
 *       400:
 *         description: Error en los datos
 *       401:
 *         description: No autorizado
 */
router.post("/", authMiddleware, commerceValidators, commerceController.createCommerce); 

/**
 * @openapi
 * /commerces/update/{cif}:
 *   put:
 *     summary: Actualizar un comercio
 *     tags:
 *       - Comercios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Error en los datos
 *       401:
 *         description: No autorizado
 */
router.put("/update/:cif", authMiddleware, [...cifValidator, ...commerceValidators], commerceController.updateCommerce);

/**
 * @openapi
 * /commerces/{cif}:
 *   delete:
 *     summary: Borrar un comercio
 *     tags:
 *       - Comercios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [logico, fisico]
 *     responses:
 *       200:
 *         description: Comercio borrado exitosamente
 *       400:
 *         description: Error en los datos
 *       401:
 *         description: No autorizado
 */
router.delete("/:cif", authMiddleware, [
    ...cifValidator,
    query("tipo").isIn(["logico", "fisico"]).withMessage("El tipo debe ser 'logico' o 'fisico'.")
], commerceController.deleteCommerce);

module.exports = router;