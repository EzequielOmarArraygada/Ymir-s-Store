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
    addProduct,
    updateProduct,
    deleteProduct,
    getProductDetails
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Agregar un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Nombre del producto'
 *               description:
 *                 type: string
 *                 example: 'Descripción del producto'
 *               price:
 *                 type: number
 *                 example: 100
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Producto agregado exitosamente
 */
ProductsRouter.post('/products', passportCall('login', 'premium'), requirePremium, addProduct);

/**
 * @swagger
 * /products/{pid}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Nombre actualizado'
 *               description:
 *                 type: string
 *                 example: 'Descripción actualizada'
 *               price:
 *                 type: number
 *                 example: 120
 *               stock:
 *                 type: number
 *                 example: 30
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
ProductsRouter.put('/products/:pid', passportCall('login', 'premium'), requireOwnershipOrAdmin, updateProduct);


/**
 * @swagger
 * /products/{pid}:
 *   delete:
 *     summary: Eliminar un producto
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
 *         description: Producto eliminado exitosamente
 */
ProductsRouter.delete('/products/:pid', deleteProduct);

export default ProductsRouter;
