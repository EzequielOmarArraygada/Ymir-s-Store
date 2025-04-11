import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import { CartManagerMongo } from '../dao/services/managers/CartManagerMongo.js';
import { UserRepository } from '../repositories/user.repository.js';
import Ticket from '../dao/models/ticket.model.js';
import productModel from '../dao/models/product.model.js'
import { TicketManagerMongo } from '../dao/services/managers/TicketManagerMongo.js'
import { sendCompraAprobada, sendCompraPendiente, sendCompraCancelada } from '../services/mailing.js'
import mercadopago from 'mercadopago';
import dotenv from "dotenv"


dotenv.config();

const generateTicketCode = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`; // ✅ CORREGIDO: uso de backticks
};


const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export class CartController {
    constructor() {
        this.productsService = new ProductManagerMongo();
        this.cartsService = new CartManagerMongo();
        this.userService = new UserRepository();
        this.ticketsService = new TicketManagerMongo();
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
            const cartCount = await this.cartsService.getCartByIdCount(cid);
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

    deleteProduct = async (req, res) => {
        let { cid, pid } = req.params;
        let result = await this.cartsService.deleteProduct(pid, cid);
        res.send({ result: 'success', payload: result });
    }

    deleteAllProducts = async (req, res) => {
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
            const productsDetails = [];
            let totalAmount = 0
            for (const product of cart.products) {
                const productDetails = await this.productsService.getProduct(product.productId);
                preferenceItems.push({
                    title: productDetails.title,
                    unit_price: productDetails.price,
                    currency_id: "ARS",
                    quantity: product.quantity,
                });
                productsDetails.push({ ...productDetails, quantity: product.quantity });
                totalAmount += productDetails.price * product.quantity;
            }

            // Generar ticket anticipado con estado "Pendiente"
            const comprador = await this.userService.findById(req.user._id);
            const code = generateTicketCode();


            const emptyTicket = new Ticket({
                code,
                purchaser: comprador,
                products: productsDetails,
                totalAmount: totalAmount,
                status: "Pendiente",
                purchase_datetime: new Date(),
                paymentInf: {}
            });

            const savedTicket = await emptyTicket.save();

            // Crear preferencia
            const preference = {
                items: preferenceItems,
                back_urls: {
                    success: "https://ymir.up.railway.app//api/carts/success",
                    failure: "https://ymir.up.railway.app//api/carts/failure",
                    pending: "https://ymir.up.railway.app//api/carts/pending"
                },
                external_reference: JSON.stringify({ ticketId: savedTicket._id, compradorId: comprador.id }),
                notification_url: "https://ymir.up.railway.app//api/carts/webhook",
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
        try {
            const paymentId = req.query.payment_id;
            const payment = await mercadopago.payment.findById(paymentId);
            const paymentInfo = payment.body;
            const metodoPago = paymentInfo.payment_type_id;
            const fechaPago = paymentInfo.date_approved;
            let ultimosDigitos = null;
            let cuotas = null;
            let metodo = null;
            let ticketId = null;
            let compradorId = null;
            console.log("🔎 PaymentInfo:", JSON.stringify(paymentInfo, null, 2));

                if (paymentInfo.card) {
                    ultimosDigitos = paymentInfo.card.last_four_digits || null;
                    cuotas = paymentInfo.installments || null;
                    metodo = capitalizeFirst(paymentInfo.payment_method_id);
                } else {
                    console.warn("⚠️ El objeto 'card' no está presente en el pago.");
                }

            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    ticketId = parsedRef.ticketId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }

            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    compradorId = parsedRef.compradorId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }

            let ticket = null;
            if (ticketId) {
                ticket = await Ticket.findById(ticketId).populate("purchaser");
            }

            if (!ticket) {
                req.logger.error(`Ticket no encontrado o inválido. ticketId: ${ticketId}`);
                return res.status(404).json({ error: 'Ticket no encontrado o inválido' });
            }
            let user = await this.userService.findById(compradorId);
            const cart = await this.cartsService.getCartById(user.cart._id);


            if (ticket.status !== "Aprobado" && paymentInfo.status === "approved") {
                const cart = await this.cartsService.getCartById(ticket.purchaser.cart);
                const productsDetails = [];
                if (cart && cart.products.length > 0) {
                    for (const product of cart.products) {
                        const productDetails = await this.productsService.getProduct(product.productId);

                        if (productDetails.stock < product.quantity) {
                            return res.render('failure', {
                                message: `El producto ${productDetails.title} no tiene suficiente stock.`
                            });
                        }

                        productsDetails.push({ ...productDetails, quantity: product.quantity });
                        await this.productsService.updateProduct(product.productId, {
                            stock: productDetails.stock - product.quantity
                        });
                    }

                    ticket.paymentInf = {
                        method: metodoPago,
                        paymentDate: fechaPago,
                        card: {
                            lastFourDigits: ultimosDigitos,
                            installments: cuotas,
                            issuerName: metodo
                        }
                    };
                    ticket.status = "Aprobado";
                    await ticket.save();
                }

                // Enviar mail
                await sendCompraAprobada(user.email, ticket);
            }

            if (cart) {
                cart.products = [];
                await cart.save();
            }

            return res.redirect(`/api/carts/paymentSuccess/${ticket._id}`);
        } catch (error) {
            console.error("Error en handlePaymentSuccess:", error);
            return res.status(500).json({ message: "Error al procesar el pago", error });
        }
    };

    handlePaymentPending = async (req, res) => {
        try {
            const paymentId = req.query.payment_id;
            const payment = await mercadopago.payment.findById(paymentId);
            const paymentInfo = payment.body;
            const metodoPago = paymentInfo.payment_type_id;
            const fechaPago = paymentInfo.date_approved;
            let ultimosDigitos = null;
            let cuotas = null;
            let metodo = null;
            let ticketId = null;
            let compradorId = null;
            console.log("🔎 PaymentInfo:", JSON.stringify(paymentInfo, null, 2));

                if (paymentInfo.card) {
                    ultimosDigitos = paymentInfo.card.last_four_digits || null;
                    cuotas = paymentInfo.installments || null;
                    metodo = capitalizeFirst(paymentInfo.payment_method_id);
                } else {
                    console.warn("⚠️ El objeto 'card' no está presente en el pago.");
                }

            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    ticketId = parsedRef.ticketId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }


            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    ticketId = parsedRef.ticketId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }

            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    compradorId = parsedRef.compradorId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }

            let ticket = null;
            if (ticketId) {
                ticket = await Ticket.findById(ticketId).populate("purchaser");
            }

            if (!ticket) {
                req.logger.error(`Ticket no encontrado o inválido. ticketId: ${ticketId}`);
                return res.status(404).json({ error: 'Ticket no encontrado o inválido' });
            }
            let user = await this.userService.findById(compradorId);
            const cart = await this.cartsService.getCartById(user.cart._id);

                const productsDetails = [];
                if (cart && cart.products.length > 0) {
                    for (const product of cart.products) {
                        const productDetails = await this.productsService.getProduct(product.productId);

                        if (productDetails.stock < product.quantity) {
                            return res.render('failure', {
                                message: `El producto ${productDetails.title} no tiene suficiente stock.`
                            });
                        }

                        productsDetails.push({ ...productDetails, quantity: product.quantity });
                        await this.productsService.updateProduct(product.productId, {
                            stock: productDetails.stock - product.quantity
                        });
                    }

                    ticket.paymentInf = {
                        method: metodoPago,
                        paymentDate: fechaPago,
                        card: {
                            lastFourDigits: ultimosDigitos,
                            installments: cuotas,
                            issuerName: metodo
                        }
                    };
                    await ticket.save()

                // Enviar mail
                await sendCompraPendiente(user.email, ticket);
            }

            if (cart) {
                cart.products = [];
                await cart.save();
            }

            return res.redirect(`/api/carts/paymentPending/${ticket._id}`);
        } catch (error) {
            console.error("Error en handlePaymentPending:", error);
            return res.status(500).json({ message: "Error al procesar el pago", error });
        }
    };

    handlePaymentFailure = async (req, res) => {
        try {
            const paymentId = req.query.payment_id;
            const payment = await mercadopago.payment.findById(paymentId);
            const paymentInfo = payment.body;
            const metodoPago = paymentInfo.payment_type_id;
            const fechaPago = paymentInfo.date_approved;
            let ticketId = null;
            let compradorId = null;
            let ultimosDigitos = null;
            let cuotas = null;
            let metodo = null;
            console.log("🔎 PaymentInfo:", JSON.stringify(paymentInfo, null, 2));

                if (paymentInfo.card) {
                    ultimosDigitos = paymentInfo.card.last_four_digits || null;
                    cuotas = paymentInfo.installments || null;
                    metodo = capitalizeFirst(paymentInfo.payment_method_id);
                } else {
                    console.warn("⚠️ El objeto 'card' no está presente en el pago.");
                }

            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    ticketId = parsedRef.ticketId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }


            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    ticketId = parsedRef.ticketId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }

            if (paymentInfo.external_reference) {
                try {
                    const parsedRef = JSON.parse(paymentInfo.external_reference);
                    compradorId = parsedRef.compradorId;
                } catch (err) {
                    console.warn("No se pudo parsear external_reference:", err);
                }
            }

            let ticket = null;
            if (ticketId) {
                ticket = await Ticket.findById(ticketId).populate("purchaser");
                ticket.status = "Cancelado";
                ticket.paymentInf = {
                    method: metodoPago,
                    paymentDate: fechaPago,
                    card: {
                        lastFourDigits: ultimosDigitos,
                        installments: cuotas,
                        issuerName: metodo
                    }
                };
                await ticket.save();
            }

            if (!ticket) {
                req.logger.error(`Ticket no encontrado o inválido. ticketId: ${ticketId}`);
                return res.status(404).json({ error: 'Ticket no encontrado o inválido' });
            }
            let user = await this.userService.findById(compradorId);
            await sendCompraCancelada(user.email, ticket);
            return res.redirect(`/api/carts/paymentFailure/${ticketId}`);
        } catch (error) {
            console.error("Error en handlePaymentFailure:", error);
            return res.status(500).json({ message: "Error al procesar el pago", error });
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

    paymentPending = async (req, res) => {
        try {
            const { tid } = req.params;
            const ticket = await Ticket.findById(tid).populate("purchaser");

            if (!ticket) {
                return res.status(404).render("failure", { message: "No se encontró el ticket con ese ID." });
            }

            res.render("paymentPending", { ticket });
        } catch (error) {
            console.error("Error al cargar la vista de éxito:", error);
            res.status(500).send("Error al mostrar el resumen del pago");
        }
    };

    paymentFailure = async (req, res) => {
        try {
            const { tid } = req.params;
            const ticket = await Ticket.findById(tid).populate("purchaser");

            if (!ticket) {
                return res.status(404).render("failure", { message: "No se encontró el ticket con ese ID." });
            }

            res.render("paymentFailure");
        } catch (error) {
            console.error("Error al cargar la vista de éxito:", error);
            res.status(500).send("Error al mostrar el resumen del pago");
        }
    };

    handleWebhook = async (req, res) => {
        try {
            const topic = req.query.topic;
            const resourceId = req.query.id;

            if (topic === "payment") {
                const payment = await mercadopago.payment.findById(resourceId);
                const externalRefRaw = payment.body.external_reference;

                if (!externalRefRaw) {
                    console.warn("⚠️ external_reference no presente en el pago");
                    return res.status(400).send("Falta external_reference");
                }

                const externalRef = JSON.parse(externalRefRaw);
                const ticketId = externalRef.ticketId;
                const compradorId = externalRef.compradorId;
                const paymentInfo = payment.body;
                const metodoPago = paymentInfo.payment_type_id;
                const fechaPago = paymentInfo.date_approved;
                let ultimosDigitos = null;
                let cuotas = null;
                let metodo = null;
                console.log("🔎 PaymentInfo:", JSON.stringify(paymentInfo, null, 2));

                if (paymentInfo.card) {
                    ultimosDigitos = paymentInfo.card.last_four_digits || null;
                    cuotas = paymentInfo.installments || null;
                    metodo = capitalizeFirst(paymentInfo.payment_method_id);
                } else {
                    console.warn("⚠️ El objeto 'card' no está presente en el pago.");
                }

                const comprador = await this.userService.findById(compradorId);
                const ticket = await Ticket.findById(ticketId).populate("purchaser");

                if (!ticket) {
                    return res.status(404).send("Ticket no encontrado");
                }

                let cart = null;

                if (ticket.status !== "Aprobado" && payment.body.status === "approved") {
                    cart = await this.cartsService.getCartById(ticket.purchaser.cart);

                    if (cart && cart.products.length > 0) {
                        let totalAmount = 0;

                        for (const item of ticket.products) {
                            const rawProduct = await this.productsService.getProduct(item._id);
                            const product = productModel.hydrate(rawProduct);

                            if (product.stock >= item.quantity) {
                                product.stock -= item.quantity;
                                await product.save();

                                totalAmount += product.price * item.quantity;
                            }
                        }

                        ticket.products = ticket.products;
                        ticket.totalAmount = totalAmount;
                        ticket.status = "Aprobado";
                        ticket.paymentInf = {
                            method: metodoPago,
                            paymentDate: fechaPago,
                            card: {
                                lastFourDigits: ultimosDigitos,
                                installments: cuotas,
                                issuerName: metodo
                            }}
                        await ticket.save();

                        // Enviar mail
                        await sendCompraAprobada(comprador.email, ticket);

                        if (cart) {
                            cart.products = [];
                            await cart.save();
                        }
                    }
                }

                if (ticket.status !== "Cancelado" && payment.body.status === "failure") {
                    cart = await this.cartsService.getCartById(ticket.purchaser.cart);

                    if (cart && cart.products.length > 0) {
                        let totalAmount = 0;

                        for (const item of ticket.products) {
                            const rawProduct = await this.productsService.getProduct(item._id);
                            const product = productModel.hydrate(rawProduct);

                            if (product.stock >= item.quantity) {
                                product.stock -= item.quantity;
                                await product.save();

                                totalAmount += product.price * item.quantity;
                            }
                        }

                        ticket.products = ticket.products;
                        ticket.totalAmount = totalAmount;
                        ticket.status = "Cancelado";
                        ticket.paymentInf = {
                            method: metodoPago,
                            paymentDate: fechaPago,
                            card: {
                                lastFourDigits: ultimosDigitos,
                                installments: cuotas,
                                issuerName: emisor
                            }}
                        await ticket.save();

                        // Enviar mail
                        await sendCompraCancelada(comprador.email, ticket);

                        if (cart) {
                            cart.products = [];
                            await cart.save();
                        }
                    }
                }

                return res.status(200).send("Webhook procesado con éxito");
            }

            // Si el topic no es "payment", ignoramos
            return res.status(200).send("Topic no manejado");
        } catch (error) {
            console.error("❌ Error en webhook:", error);
            return res.status(500).send("Error al procesar el webhook");
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
