const express = require("express");
const upload = require("../middlewares/upload");
const webpageController = require("../controllers/webpageController");
const { validateWebPage, validateImageUpload } = require("../validators/webpageValidators");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

/**
 * @openapi
 * /webpages:
 *   get:
 *     summary: Obtener página web
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles de la página web
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginaWeb'
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, webpageController.getWebPageById);

/**
 * @openapi
 * /webpages:
 *   post:
 *     summary: Crear nueva página web
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaginaWeb'
 *     responses:
 *       201:
 *         description: Página web creada exitosamente
 *       400:
 *         description: Error en los datos
 *       401:
 *         description: No autorizado
 */
router.post("/", authMiddleware, validateWebPage, webpageController.createWebPage);

/**
 * @openapi
 * /webpages:
 *   put:
 *     summary: Actualizar página web
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaginaWeb'
 *     responses:
 *       200:
 *         description: Página web actualizada exitosamente
 *       400:
 *         description: Error en los datos
 *       401:
 *         description: No autorizado
 */
router.put("/", authMiddleware, validateWebPage, webpageController.updateWebPage);

/**
 * @openapi
 * /webpages/archive:
 *   patch:
 *     summary: Archivar página web
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Página web archivada exitosamente
 *       401:
 *         description: No autorizado
 */
router.patch("/archive", authMiddleware, webpageController.archiveWebPage);

/**
 * @openapi
 * /webpages:
 *   delete:
 *     summary: Eliminar página web
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Página web eliminada exitosamente
 *       401:
 *         description: No autorizado
 */
router.delete("/", authMiddleware, webpageController.deleteWebPage);

/**
 * @openapi
 * /webpages/uploadImage:
 *   patch:
 *     summary: Subir imagen a página web
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *       400:
 *         description: Error al subir imagen
 *       401:
 *         description: No autorizado
 */
router.patch("/uploadImage", authMiddleware, upload.single("image"), validateImageUpload, webpageController.uploadImage);

/**
 * @openapi
 * /webpages/createReview/{id}:
 *   patch:
 *     summary: Crear reseña para página web
 *     tags:
 *       - Páginas Web
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               puntuacion:
 *                 type: number
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reseña creada exitosamente
 *       400:
 *         description: Error en los datos
 */
router.patch("/createReview/:id", webpageController.createReview);

/**
 * @openapi
 * /webpages/updateText:
 *   patch:
 *     summary: Actualizar texto de página web
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               textos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Texto actualizado exitosamente
 *       401:
 *         description: No autorizado
 */
router.patch("/updateText", authMiddleware, validateWebPage, webpageController.updateText);

/**
 * @openapi
 * /webpages/interests:
 *   get:
 *     summary: Obtener usuarios interesados
 *     tags:
 *       - Páginas Web
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios interesados
 *       401:
 *         description: No autorizado
 */
router.get("/interests", authMiddleware, webpageController.getInterested);

module.exports = router;