import express from 'express';
import ProductController from '../../controllers/product.controller.js';

const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Operaciones de gestión de productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get('/products', getProducts);

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
router.get('/products/:pid', getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
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
 *         description: Producto creado exitosamente
 */
router.post('/products', createProduct);

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
 *                 example: 'Nombre del producto actualizado'
 *               description:
 *                 type: string
 *                 example: 'Descripción del producto actualizada'
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
router.put('/products/:pid', updateProduct);


export default router;
