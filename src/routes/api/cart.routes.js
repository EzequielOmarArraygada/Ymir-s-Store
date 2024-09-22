import express from 'express';
import CartController from '../../controllers/cart.controller.js';

const router = express.Router();
const {
  createCart,
  getCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
} = new CartController();

/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Operaciones de carritos de compras
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Carrito]
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 */
router.post('/', createCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 */
router.get('/:cid', getCart);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente
 */
router.post('/:cid/product/:pid', addProductToCart);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
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
router.delete('/:cid/product/:pid', deleteProductFromCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualizar un carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
 */
router.put('/:cid', updateCart);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Cantidad actualizada exitosamente
 */
router.put('/:cid/product/:pid', updateProductQuantity);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Eliminar todos los productos del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Todos los productos eliminados del carrito exitosamente
 */
router.delete('/:cid', deleteAllProductsFromCart);

export default router;

