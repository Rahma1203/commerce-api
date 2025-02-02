const express = require("express");
const upload = require("../middlewares/upload");
const webpageController = require("../controllers/webpageController");
const { validateImageUpload,validateWebPage,validateWebPageId} = require("../validators/webpageValidators");
const { authMiddleware } = require("../middlewares/auth");


const router = express.Router();




/**
 * @openapi
 * /ciudad/{ciudad}/actividad/{actividad}:
 *   get:
 *     tags:
 *       - Páginas Web
 *     summary: Obtener páginas web por ciudad y actividad
 *     description: Devuelve una lista de páginas web filtradas por ciudad y actividad.
 *     parameters:
 *       - name: ciudad
 *         in: path
 *         required: true
 *         description: La ciudad para filtrar las páginas web.
 *         schema:
 *           type: string
 *           example: "Madrid"
 *       - name: actividad
 *         in: path
 *         required: true
 *         description: La actividad para filtrar las páginas web.
 *         schema:
 *           type: string
 *           example: "restauración"
 *     responses:
 *       200:
 *         description: Páginas web encontradas por ciudad y actividad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaginaWeb'
 *       400:
 *         description: Parámetros no válidos
 *       404:
 *         description: No se encontraron páginas web con esos filtros
 *       500:
 *         description: Error en el servidor
 */
router.get("/ciudad/:ciudad/actividad/:actividad", webpageController.getWebPagesByCityAndActivity);


/**
 * @openapi
 * /ciudad/{ciudad}:
 *   get:
 *     tags:
 *       - Páginas Web
 *     summary: Obtener páginas web por ciudad
 *     description: Devuelve las páginas web asociadas a una ciudad específica.
 *     parameters:
 *       - in: path
 *         name: ciudad
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad para filtrar las páginas web
 *     responses:
 *       200:
 *         description: Lista de páginas web
 *       400:
 *         description: Datos no válidos
 *       404:
 *         description: No se encontraron páginas web
 *       500:
 *         description: Error en el servidor
 */
router.get("/ciudad/:ciudad", webpageController.getWebPagesByCity);

/**
 * @openapi
 * /interests/ciudad/{ciudad}:
 *   get:
 *     tags:
 *       - Páginas Web
 *     summary: Obtener páginas web de usuarios interesados
 *     description: Devuelve las páginas web que los usuarios de una ciudad están interesados en recibir ofertas.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ciudad
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad para filtrar los usuarios interesados
 *     responses:
 *       200:
 *         description: Lista de páginas web
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron usuarios interesados
 *       500:
 *         description: Error en el servidor
 */
router.get("/interests/ciudad/:ciudad", authMiddleware, webpageController.getInterested);

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Páginas Web
 *     summary: Obtener todas las páginas web
 *     description: Devuelve todas las páginas web disponibles en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de páginas web
 *       500:
 *         description: Error en el servidor
 */
router.get("/", webpageController.getAllWebPages);

/**
 * @openapi
 * /{id}:
 *   get:
 *     tags:
 *       - Páginas Web
 *     summary: Obtener una página web por ID
 *     description: Devuelve los detalles de una página web específica usando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     responses:
 *       200:
 *         description: Página web encontrada
 *       400:
 *         description: ID no válido
 *       404:
 *         description: Página web no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.get("/:id", validateWebPageId, webpageController.getWebPageById);

/**
 * @openapi
 * /:
 *   post:
 *     tags:
 *       - Páginas Web
 *     summary: Crear una nueva página web
 *     description: Permite crear una nueva página web.
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
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post("/", authMiddleware, webpageController.createWebPage);

/**
 * @openapi
 * /:
 *   put:
 *     tags:
 *       - Páginas Web
 *     summary: Actualizar una página web existente
 *     description: Permite actualizar una página web existente.
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
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Página web no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.put("/", authMiddleware, validateWebPage, webpageController.updateWebPage);

/**
 * @openapi
 * /archive:
 *   patch:
 *     tags:
 *       - Páginas Web
 *     summary: Archivar una página web
 *     description: Permite archivar una página web para no mostrarla.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Página web archivada exitosamente
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.patch("/archive", authMiddleware, webpageController.archiveWebPage);

/**
 * @openapi
 * /:
 *   delete:
 *     tags:
 *       - Páginas Web
 *     summary: Eliminar una página web
 *     description: Elimina una página web de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Página web eliminada exitosamente
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.delete("/", authMiddleware, webpageController.deleteWebPage);

/**
 * @openapi
 * /uploadImage:
 *   patch:
 *     tags:
 *       - Páginas Web
 *     summary: Subir una imagen a una página web
 *     description: Permite subir una imagen a una página web existente.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.patch("/uploadImage", authMiddleware, upload.single("image"), validateImageUpload, webpageController.uploadImage);

/**
 * @openapi
 * /createReview/{id}:
 *   patch:
 *     tags:
 *       - Páginas Web
 *     summary: Crear una reseña para una página web
 *     description: Permite crear una reseña para una página web.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página web
 *     responses:
 *       200:
 *         description: Reseña creada exitosamente
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.patch("/createReview/:id", authMiddleware, validateWebPageId, webpageController.createReview);

/**
 * @openapi
 * /updateText:
 *   patch:
 *     tags:
 *       - Páginas Web
 *     summary: Actualizar el texto de una página web
 *     description: Permite a un usuario autenticado actualizar el texto de una página web.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Texto de la página web actualizado exitosamente
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.patch("/updateText", authMiddleware, validateWebPage, webpageController.updateText);


module.exports = router;