import { Router } from 'express';
import { CartController } from '../controllers/carts.controller.js';
import utils from '../utils.js';

const { passportCall } = utils;
const cartRouter = Router()

const {
    getCarts,
    getCartById,
    addCart,
    addToCart,
    updateProductQuantity,
    updateCart,
    deleteProduct,
    deleteAllProducts,
    getPurchase,
    checkout,
    getCartByIdCount
} = new CartController();

/**
 * @swagger
 * tags:
 *   name: Carritos
 *   description: Operaciones de gestión de carritos
 */

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtener todos los carritos
 *     tags: [Carritos]
 *     responses:
 *       200:
 *         description: Lista de carritos obtenida exitosamente
 */
cartRouter.get('/', getCarts);


/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     tags: [Carritos]
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
cartRouter.get('/:cid', getCartById);

cartRouter.get('/:cid/count', getCartByIdCount);


/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Carritos]
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 */
cartRouter.post('/', addCart);

/**
 * @swagger
 * /api/carts/{cid}/{pid}:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Carritos]
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
cartRouter.post('/:cid/:pid', addToCart);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     tags: [Carritos]
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
cartRouter.put('/:cid/products/:pid', updateProductQuantity);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualizar un carrito
 *     tags: [Carritos]
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
cartRouter.put('/:cid', updateCart);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carritos]
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
cartRouter.delete('/:cid/products/:pid', deleteProduct);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Eliminar todos los productos del carrito
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *        200:
 *         description: Todos los productos eliminados del carrito exitosamente
 */
cartRouter.delete('/:cid', deleteAllProducts);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   get:
 *     summary: Obtener el estado de la compra
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Estado de la compra obtenido exitosamente
 */
cartRouter.get('/:cid/purchase', getPurchase);

/**
 * @swagger
 * /api/carts/{cid}:
 *   post:
 *     summary: Finalizar la compra
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Compra finalizada exitosamente
 */
cartRouter.post('/:cid', passportCall('login', 'user'), checkout);

export default cartRouter;
