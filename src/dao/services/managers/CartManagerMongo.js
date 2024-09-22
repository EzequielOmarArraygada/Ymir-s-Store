import { CartRepository } from '../../../repositories/cart.repository.js';
import logger from '../../../config/logger.js'; 

export class CartManagerMongo {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    async getCarts() {
        try {
            return await this.cartRepository.getCarts();
        } catch (error) {
            logger.error(`Error al mostrar los carritos: ${error.message}`, { error });
            throw new Error('No se pudieron obtener los carritos. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    async getCartById(cid) {
        try {
            return await this.cartRepository.getCartById(cid);
        } catch (error) {
            logger.error(`Error al obtener el carrito con ID ${cid}: ${error.message}`, { cid, error });
            throw new Error('No se pudo obtener el carrito especificado. Por favor, verifique el ID y vuelva a intentarlo.');
        }
    }

    async getCartByIdCount(cid) {
        try {
            return await this.cartRepository.getCartByIdCount(cid);
        } catch (error) {
            logger.error(`Error al obtener el carrito con ID ${cid}: ${error.message}`, { cid, error });
            throw new Error('No se pudo obtener el carrito especificado. Por favor, verifique el ID y vuelva a intentarlo.');
        }
    }

    async addCart() {
        try {
            return await this.cartRepository.addCart();
        } catch (error) {
            logger.error(`Error al agregar un nuevo carrito: ${error.message}`, { error });
            throw new Error('No se pudo crear un nuevo carrito. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    async addToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    
        if (productIndex > -1) {
            // Si el producto ya existe en el carrito, sumar la cantidad nueva a la existente
            cart.products[productIndex].quantity = parseInt(cart.products[productIndex].quantity) + parseInt(quantity);
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad especificada
            cart.products.push({ productId, quantity });
        }
    
        return await cart.save();
    }

    async updateCart(cart) {
        try {
            return await this.cartRepository.updateCart(cart);
        } catch (error) {
            logger.error(`Error al actualizar el carrito con ID ${cart.id}: ${error.message}`, { cart, error });
            throw new Error('No se pudo actualizar el carrito. Por favor, verifique los datos del carrito e inténtelo de nuevo.');
        }
    }

    async deleteProduct(pid, cid) {
        try {
            return await this.cartRepository.deleteProduct(pid, cid);
        } catch (error) {
            logger.error(`Error al eliminar el producto con ID ${pid} del carrito con ID ${cid}: ${error.message}`, { cid, pid, error });
            throw new Error('No se pudo eliminar el producto del carrito. Por favor, verifique los IDs e inténtelo de nuevo.');
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            return await this.cartRepository.updateProductQuantity(cid, pid, quantity);
        } catch (error) {
            logger.error(`Error al actualizar la cantidad del producto con ID ${pid} en el carrito con ID ${cid}: ${error.message}`, { cid, pid, quantity, error });
            throw new Error('No se pudo actualizar la cantidad del producto en el carrito. Por favor, verifique los IDs y la cantidad.');
        }
    }

    async deleteAllProducts(cid) {
        try {
            return await this.cartRepository.deleteAllProducts(cid);
        } catch (error) {
            logger.error(`Error al eliminar todos los productos del carrito con ID ${cid}: ${error.message}`, { cid, error });
            throw new Error('No se pudieron eliminar todos los productos del carrito. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    async checkout(cart, userEmail) {
        try {
            return await this.cartRepository.checkout(cart, userEmail);
        } catch (error) {
            logger.error(`Error al procesar la compra para el carrito con ID ${cart.id} y usuario ${userEmail}: ${error.message}`, { cart, userEmail, error });
            throw new Error('No se pudo completar la compra. Por favor, inténtelo de nuevo más tarde.');
        }
    }
}
