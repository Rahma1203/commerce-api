const express = require("express")
const {validatorRegister,  validatorLogin} = require("../validators/auth")
const { registerCtrl, loginCtrl,UpdateUserCtrl,deleteUserCtrl } = require("../controllers/user")
const { authMiddleware } = require("../middlewares/auth")

const router = express.Router()


/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la validación de datos
 */
router.post("/register", validatorRegister, registerCtrl)

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", validatorLogin, loginCtrl)

/**
 * @openapi
 * /user/update:
 *   put:
 *     tags:
 *       - Autenticación
 *     summary: Actualizar usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       401:
 *         description: No autorizado
 */
router.put("/update", authMiddleware, validatorRegister, UpdateUserCtrl)

/**
 * @openapi
 * /user/delete:
 *   delete:
 *     tags:
 *       - Autenticación
 *     summary: Eliminar usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 */
router.delete("/delete", authMiddleware, deleteUserCtrl)
module.exports = router