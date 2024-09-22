import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import { CartManagerMongo } from '../dao/services/managers/CartManagerMongo.js';
import { UserRepository } from '../repositories/user.repository.js';
import Ticket from '../dao/models/ticket.model.js';
import { sendMailCompra } from '../services/mailing.js'

export class CartController {
    constructor(){
        this.productsService = new ProductManagerMongo();
        this.cartsService = new CartManagerMongo();
        this.userService = new UserRepository();
    }

    getCarts = async (req, res) => {
        try {
            let result = await this.cartsService.getCarts()
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al recuperar los carritos: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al obtener los carritos.' });
        }
    }

    getCartById = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartsService.getCartById(cid);
            const productsDetails = [];
            let totalPrice = 0;
    
            for (const product of cart.products) {
                const productDetails = await this.productsService.getProduct(product.productId);
                const productWithQuantity = { ...productDetails, quantity: product.quantity }; 
                productsDetails.push(productWithQuantity);
    
                const subtotal = productDetails.price * product.quantity;
                totalPrice += subtotal;
            }
            res.render('carts', { cart, productsDetails, totalPrice, cartId: cart._id });
        } catch (error) {
            req.logger.error(
                `Error al recuperar el carrito por ID: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al obtener el carrito.' });
        }
    }

    getCartByIdCount = async (req, res) => {
        try {
            const { cid } = req.params;
            console.log("CID: ", cid); 
            const cartCount = await this.cartsService.getCartByIdCount(cid);
            console.log("Cart Count: ", cartCount); 
            if (!cartCount) {
                return res.status(404).send({ error: 'Carrito no encontrado.' });
            }
    
            const productsDetailsCount = [];
            let totalPriceCount = 0;
    
            for (const product of cartCount.products) {
                const productDetailsCount = await this.productsService.getProduct(product.productId);
                const productWithQuantityCount = { ...productDetailsCount, quantity: product.quantity }; 
                productsDetailsCount.push(productWithQuantityCount);
    
                const subtotalCount = productDetailsCount.price * product.quantity;
                totalPriceCount += subtotalCount;
            }
            res.send({ result: 'success', cart: cartCount, productsDetailsCount, totalPriceCount });
        } catch (error) {
            req.logger.error(
                `Error al recuperar el carrito por ID: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al obtener el carrito.' });
        }
    }
    
    addCart = async (req, res) => {
        let result = await this.cartsService.addCart();
        res.send({ result: 'success', payload: result });
    }
    
    addToCart = async (req, res) => {
        try {
            let { cid, pid } = req.params;
            let userId = req.session.clientId;
            let { quantity } = req.body;
    
            if (!cid || !pid || !quantity || isNaN(quantity) || quantity <= 0) {
                req.logger.error(`Faltan parámetros o cantidad inválida: cid (${cid}), pid (${pid}), quantity (${quantity}).`);
                return res.status(400).send({ error: 'Faltan el ID del carrito, el ID del producto o la cantidad es inválida.' });
            }
    
            const product = await this.productsService.getProduct(pid);
            if (!product) {
                req.logger.error(`Producto no encontrado: pid (${pid}).`);
                return res.status(404).send({ error: 'Producto no encontrado.' });
            }
            
            if (product.owner.toString() === userId) {
                req.logger.warning(
                    `El usuario intentó agregar su propio producto al carrito: ${product._id}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
                );
                return res.status(400).send({ error: 'No puedes agregar tu propio producto al carrito.' });
            }

            if (product.stock < quantity) {
                req.logger.warning(
                    `Cantidad solicitada mayor que el stock disponible: ${product._id}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
                );
                return res.status(400).send({ error: 'La cantidad solicitada supera el stock disponible.' });
            }
    
            const result = await this.cartsService.addToCart(cid, pid, quantity);
            req.logger.debug(`Producto agregado al carrito: ${result}`);
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al agregar el producto al carrito: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al agregar el producto al carrito.' });
        }
    }
    

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const result = await this.cartsService.updateProductQuantity(cid, pid, quantity);
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al actualizar la cantidad del producto en el carrito: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al actualizar la cantidad del producto en el carrito.' });
        }
    }

    updateCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const result = await this.cartsService.updateCart(cid);
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al actualizar el carrito: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al actualizar el carrito.' });
        }
    }

    deleteProduct = async(req, res) => {
        let { cid, pid } = req.params;
        let result = await this.cartsService.deleteProduct(pid, cid);
        res.send({ result: 'success', payload: result });
    }

    deleteAllProducts = async(req, res) => {
        try {
            const { cid } = req.params;
            const result = await this.cartsService.deleteAllProducts(cid);
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al eliminar todos los productos del carrito: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al eliminar todos los productos del carrito.' });
        }
    }

    checkout = async (req, res) => {
        try {
            const { cid } = req.params
            const cart = await this.cartsService.getCartById(cid);
            const productsDetails = [];
            const productsTicket = [];
            let totalAmount = 0;

            function generateRandomCode(length) {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return result;
            }
            
            function generateTicketCode() {
                const timestamp = Date.now().toString();
                const randomNum = generateRandomCode(6); 
                return `${timestamp}-${randomNum}`;
            }

    
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
    
            // Generar el ticket
            let uid = req.user._id;
            const comprador = await this.userService.findById(uid);
            const code = generateTicketCode();

            for (const product of cart.products) {
                const productDetails = await this.productsService.getProduct(product.productId);
                const productWithQuantity = { ...productDetails, quantity: product.quantity }; 
                productsDetails.push(productWithQuantity);
    
                const subtotal = productDetails.price * product.quantity;
                totalAmount += subtotal;

                productsTicket.push({ ...productDetails, quantity: product.quantity, productId: product.productId }); 

                
                await this.productsService.updateProduct(product.productId, {
                    stock: productDetails.stock - product.quantity
                });
            }

            

            const ticket = new Ticket({
                code: code,
                purchaser: comprador,
                products: productsTicket,
                totalAmount: totalAmount,
                purchase_datetime: new Date()
            });
    
            await ticket.save();
    
            cart.products = [];
            await cart.save();

            sendMailCompra(comprador.email, ticket)
    
            return res.status(200).json({ message: 'Purchase successful', ticket });
            
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            req.logger.error(`Error al procesar la compra: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`);
            return res.status(500).json({ message: 'Server error', error });
        }
    };
    
    getPurchase = async (req, res) => {
        try {
            const { cid } = req.params;
            res.json({ message: `¡Compra exitosa para el carrito ${cid}!` });
        } catch (error){
            req.logger.error(
                `Error en la confirmación de la compra: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error en la confirmación de la compra.' });
        }
    }

    getUserCartId = async (req, res) => {
        try {
            const userId = req.user._id;
            req.logger.debug(
                `ID del usuario: ${userId}, Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );

            const user = await this.userService.findById(userId);

            if (user) {
                req.logger.debug(
                    `ID del carrito del usuario: ${user.cart}, Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
                );
                res.status(200).json({ cartId: user.cart });
            } else {
                res.status(404).json({ error: 'Usuario no encontrado.' });
            }
        } catch (error) {
            req.logger.error(
                `Error al recuperar el ID del carrito del usuario: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }

    

}
