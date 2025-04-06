import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import { CartManagerMongo } from '../dao/services/managers/CartManagerMongo.js';
import { UserRepository } from '../repositories/user.repository.js';
import Ticket from '../dao/models/ticket.model.js';
import { sendMailCompra } from '../services/mailing.js'
import mercadopago from 'mercadopago';
import dotenv from "dotenv"


dotenv.config();

const generateTicketCode = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`; // ✅ CORREGIDO: uso de backticks
  };

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
            const user = req.user
            const productsDetails = [];
            let totalPrice = 0;
    
            for (const product of cart.products) {
                const productDetails = await this.productsService.getProduct(product.productId);
                const productWithQuantity = { ...productDetails, quantity: product.quantity }; 
                productsDetails.push(productWithQuantity);
    
                const subtotal = productDetails.price * product.quantity;
                totalPrice += subtotal;
            }
            res.render('carts', { cart, user, productsDetails, totalPrice, cartId: cart._id });
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



    
    createOrder = async (req, res) => {
        try {
          const { cid } = req.params;
          const cart = await this.cartsService.getCartById(cid);
      
          if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
          }
      
          const preferenceItems = [];
          for (const product of cart.products) {
            const productDetails = await this.productsService.getProduct(product.productId);
            preferenceItems.push({
              title: productDetails.title,
              unit_price: productDetails.price,
              currency_id: "ARS",
              quantity: product.quantity,
            });
          }
      
          const preference = {
            items: preferenceItems,
            back_urls: {
              success: "http://localhost:8080/api/carts/success",
              failure: "http://localhost:8080/api/carts/paymentFailure",
              pending: "http://localhost:8080/api/carts/paymentPending"
            },
            external_reference: JSON.stringify({ cid, uid: req.user._id }),
            auto_return: "approved",
          };
      
          const response = await mercadopago.preferences.create(preference);
          return res.status(200).json({
            message: "Orden creada con éxito",
            init_point: response.body.init_point
          });
        } catch (error) {
          console.error('Error al crear la orden:', error);
          return res.status(500).json({ message: 'Error interno del servidor', error });
        }
    };

    handlePaymentSuccess = async (req, res) => {
        console.log("✅ Entró en handlePaymentSuccess");
        console.log("Query de éxito:", req.query);
        try {
            const { payment_id } = req.query;
    
            // Obtener detalles del pago desde MercadoPago
            const paymentResponse = await mercadopago.payment.get(payment_id);
            const paymentStatus = paymentResponse.body.status;
    
            if (paymentStatus !== "approved") {
                return res.render('pending', { message: "El pago aún no fue aprobado", paymentStatus });
            }
    
            // Extraer el carrito y usuario del campo external_reference
            const externalReference = JSON.parse(paymentResponse.body.external_reference);
            const { cid, uid } = externalReference;
    
            // Obtener el carrito y validaciones
            const cart = await this.cartsService.getCartById(cid);
            if (!cart || cart.products.length === 0) {
                return res.status(400).render('failure', { message: 'El carrito está vacío o no existe.' });
            }
    
            const comprador = await this.userService.findById(uid);
            const code = generateTicketCode();
            const productsDetails = [];
            const productsTicket = [];
            let totalAmount = 0;
    
            // Procesar productos: calcular total, actualizar stock
            for (const product of cart.products) {
                const productDetails = await this.productsService.getProduct(product.productId);
    
                if (productDetails.stock < product.quantity) {
                    return res.render('failure', {
                        message: `El producto ${productDetails.title} no tiene suficiente stock.`
                    });
                }
    
                productsDetails.push({ ...productDetails, quantity: product.quantity });
                productsTicket.push({ ...productDetails, quantity: product.quantity, productId: product.productId });
                totalAmount += productDetails.price * product.quantity;
    
                await this.productsService.updateProduct(product.productId, {
                    stock: productDetails.stock - product.quantity
                });
            }
    
            // Generar ticket

            const translatedStatus = {
                approved: "Aprobado",
                pending: "Pendiente",
                cancelled: "Cancelado"
              }[paymentStatus] || "Pendiente";
              
            const ticket = new Ticket({
                code,
                purchaser: comprador,
                products: productsTicket,
                totalAmount,
                status: translatedStatus,
                purchase_datetime: new Date()
            });
            await ticket.save();
    
            // Vaciar el carrito
            cart.products = [];
            await cart.save();
    
            // Enviar correo de confirmación
            await sendMailCompra(comprador.email, ticket);
    
            // Redirigir a productos con mensaje
            return res.redirect(`/api/carts/paymentSuccess/${ticket._id}`);
    
        } catch (error) {
            console.error('Error en handlePaymentSuccess:', error);
            req.logger.error(
                `Error en handlePaymentSuccess: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            return res.status(500).render('failure', { message: "Ocurrió un error al procesar el pago." });
        }
    };

    paymentSuccess = async (req, res) => {
        try {
            const { tid } = req.params;
            const ticket = await Ticket.findById(tid).populate("purchaser");
    
            if (!ticket) {
                return res.status(404).render("failure", { message: "No se encontró el ticket con ese ID." });
            }
    
            res.render("paymentSuccess", { ticket });
        } catch (error) {
            console.error("Error al cargar la vista de éxito:", error);
            res.status(500).send("Error al mostrar el resumen del pago");
        }
    };
    
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
