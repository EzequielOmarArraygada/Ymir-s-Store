import { Router } from 'express';
import { CartController } from '../controllers/carts.controller.js';
import utils from '../utils.js';
import express from 'express'

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
    getCartByIdCount,
    createOrder,
    handlePaymentSuccess,
    paymentSuccess,
    handleWebhook
} = new CartController();


// Rutas para manejar las redirecciones de MercadoPago
cartRouter.get('/createorder', passportCall('login', 'user'), createOrder);

cartRouter.get('/createOrder/:cid', passportCall('login', 'user'), createOrder);

cartRouter.get('/success', handlePaymentSuccess);

cartRouter.get('/paymentFailure', (req, res) => {
    return res.render('paymentFailure', { message: "El pago no se pudo completar, por favor intente nuevamente." });
});
cartRouter.get('/paymentPending', (req, res) => {
    return res.render('paymentPending', { message: "El pago está pendiente de confirmación." });
});

cartRouter.get('/paymentSuccess/:tid', passportCall('login', 'user'), paymentSuccess);

cartRouter.post('/webhook', handleWebhook);

cartRouter.get('/', passportCall('login', 'user'), getCarts);

cartRouter.get('/:cid', passportCall('login', 'user'), getCartById);

cartRouter.get('/:cid/count', passportCall('login', 'user'), getCartByIdCount);

cartRouter.post('/', addCart);

cartRouter.post('/:cid/:pid', passportCall('login', 'user'), addToCart);

cartRouter.put('/:cid/products/:pid', updateProductQuantity);

cartRouter.put('/:cid', passportCall('login', 'user'), updateCart);

cartRouter.delete('/:cid/products/:pid', deleteProduct);

cartRouter.delete('/:cid', deleteAllProducts);





export default cartRouter;
