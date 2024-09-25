import express from 'express';
import { ProductController } from '../controllers/products.controller.js';
import utils from '../utils.js';

const { passportCall, requireOwnershipOrAdmin, requirePremium, ensureAuthenticated } = utils;
const ProductsRouter = express.Router()

const {
    getHome,
    getLogin,
    getSignup,
    getProducts,
    getProductById,
    getProductDetails,
} = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos para usuarios autenticados
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Página de inicio
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Página de inicio
 */
ProductsRouter.get('/', getHome);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Página de login
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Página de login
 */
ProductsRouter.get('/login', getLogin);

/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Página de registro
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Página de registro
 */
ProductsRouter.get('/signup', getSignup);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos (autenticado)
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
ProductsRouter.get('/products', passportCall('login', 'user'), getProducts);

ProductsRouter.get('/products/details/:pid', passportCall('login', 'user'), getProductDetails);


/**
 * @swagger
 * /products/{pid}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 */
ProductsRouter.get('/products/:pid', passportCall('login', 'user'), getProductById);




export default ProductsRouter;
