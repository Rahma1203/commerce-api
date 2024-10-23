const express = require("express");
const upload = require("../middlewares/upload");
const webpageController = require("../controllers/webpageController");
const { validateWebPage, validateImageUpload } = require("../validators/webpageValidators");

const router = express.Router();

// Obtener una página web por ID.
router.get("/:id", webpageController.getWebPageById);

// Crear una nueva página web (validación incluida).
router.post("/", validateWebPage, webpageController.createWebPage);

// Actualizar una página web (validación incluida).
router.put("/:id", validateWebPage, webpageController.updateWebPage);

// Archivar una página web.
router.patch("/archive/:id", webpageController.archiveWebPage);

// Eliminar una página web.
router.delete("/:id", webpageController.deleteWebPage);

// Subir una imagen al array de imágenes (con validación de imagen).
router.patch("/uploadImage/:id", validateImageUpload, upload.single("image"), webpageController.uploadImage);

module.exports = router;