const express = require("express")
const {validatorRegister,  validatorLogin, validatorUpdate } = require("../validators/auth")
const { registerCtrl, loginCtrl,UpdateUserCtrl,deleteUserCtrl } = require("../controllers/auth")
const { authMiddleware } = require("../middlewares/auth")

const router = express.Router()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Autenticación
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
 *         description: Error en los datos de registro
 */
router.post("/register", validatorRegister, registerCtrl)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Autenticación
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
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", validatorLogin, loginCtrl)

/**
 * @openapi
 * /auth/update:
 *   put:
 *     summary: Actualizar usuario
 *     tags:
 *       - Autenticación
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
 *       400:
 *         description: Error en los datos de actualización
 */
router.put("/update", authMiddleware, validatorUpdate, UpdateUserCtrl)

/**
 * @openapi
 * /auth/delete:
 *   delete:
 *     summary: Eliminar usuario
 *     tags:
 *       - Autenticación
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