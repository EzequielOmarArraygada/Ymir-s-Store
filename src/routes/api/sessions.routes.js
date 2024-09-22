import express from 'express';
import { passportCall } from '../../utils.js';
import SessionsController from '../../controllers/sessions.controller.js';

const router = express.Router();
const { register, login, logout, restore } = new SessionsController();

/**
 * @swagger
 * /session/register:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Sesiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "test@example.com"
 *               password: "password"
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en el registro
 */
router.post('/register', passportCall('register'), register);

/**
 * @swagger
 * /session/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Sesiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "test@example.com"
 *               password: "password"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', passportCall('login'), login);

/**
 * @swagger
 * /session/logout:
 *   get:
 *     summary: Cierra sesión de usuario
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.get('/logout', logout);

/**
 * @swagger
 * /session/restore:
 *   post:
 *     summary: Restaura la sesión de usuario
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Sesión restaurada exitosamente
 *       400:
 *         description: Error al restaurar la sesión
 */
router.post('/restore', restore);

export default router;
