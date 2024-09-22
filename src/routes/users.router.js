import { Router } from 'express';
import passport from 'passport';
import { UserController } from '../controllers/users.controller.js';
import utils from '../utils.js';
import upload from '../middlewares/upload.js';

const { passportCall } = utils;
const UsersRouter = Router();
const {
    postSignup,
    postLogin,
    getSignOut,
    togglePremium,
    uploadDocuments,
    getAllUsers,
    deleteInactiveUsers,
    requestPasswordReset,
    getPasswordReset,
    postPasswordReset,
} = new UserController();

/**
 * @swagger
 * /api/sessions/signup:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Usuarios]
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
UsersRouter.post('/signup', passport.authenticate('signup', { 
    failureRedirect: '/failregister', 
    failureMessage: true 
}), postSignup);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Usuarios]
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
UsersRouter.post('/login', postLogin);

/**
 * @swagger
 * /api/sessions/signout:
 *   get:
 *     summary: Cierra sesión de usuario
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: Usuario no autenticado
 */
UsersRouter.get('/signout', passportCall('login', 'user'), getSignOut);

/**
 * @swagger
 * /api/sessions/premium/{uid}:
 *   put:
 *     summary: Alterna el rol del usuario entre 'user' y 'premium'
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Rol del usuario cambiado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */
UsersRouter.put('/premium/:uid', passportCall('login', 'user'), togglePremium);

/**
 * @swagger
 * /api/sessions/{uid}/documents:
 *   post:
 *     summary: Subir documentos del usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Documentos subidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Error al subir documentos
 *       401:
 *         description: Usuario no autenticado
 */
UsersRouter.post('/:uid/documents', passportCall('login', 'user'), upload.array('documents', 10), uploadDocuments);

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Obtiene todos los usuarios con sus datos principales
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                   correo:
 *                     type: string
 *                   rol:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */
UsersRouter.get('/', getAllUsers);

/**
 * @swagger
 * /api/sessions:
 *   delete:
 *     summary: Elimina todos los usuarios que no hayan tenido conexión en los últimos días
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuarios inactivos eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
UsersRouter.delete('/', deleteInactiveUsers);

/**
 * @swagger
 * /api/sessions/password-reset-request:
 *   post:
 *     summary: Solicitud de restablecimiento de contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Correo de restablecimiento de contraseña enviado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

UsersRouter.post('/password-reset-request', passportCall('login', 'user'), requestPasswordReset);

/**
 * @swagger
 * /api/sessions/reset-password:
 *   post:
 *     summary: Restablecer la contraseña del usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword: "newPassword123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Error al restablecer la contraseña
 *       500:
 *         description: Error interno del servidor
 */

UsersRouter.post('/reset-password', postPasswordReset);getPasswordReset

UsersRouter.get('/reset-password', getPasswordReset);

export default UsersRouter;
