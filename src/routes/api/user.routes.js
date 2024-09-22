import { Router } from 'express';
import UserController from '../../controllers/user.controller.js';

const router = Router();
const { getUsers, createUser } = new UserController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error en la creación del usuario
 */
router.post('/', createUser);

// Ruta de prueba de logs
router.get('/loggerTest', (req, res) => {
    logger.debug('Mensaje de debug');
    logger.http('Mensaje http');
    logger.info('Mensaje info');
    logger.warning('Mensaje warning');
    logger.error('Mensaje error');
    logger.fatal('Mensaje fatal');
    res.send('Mensajes de log enviados');
});

export default router;
