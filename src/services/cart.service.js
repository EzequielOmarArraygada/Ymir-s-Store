import CartDao from '../dao/cartDao.js';
import ProductDao from '../dao/productDao.js';

export default class CartService {
  constructor() {
    this.cartDao = new CartDao();
    this.productDao = new ProductDao();
  }

  createCart = async () => {
    try {
      return await this.cartDao.create();
    } catch (error) {
      return Promise.reject('Error' + error);
    }
  };

  getCart = async (id) => {
    try {
      return this.cartDao.get(id);
    } catch (error) {
      return Promise.reject('Error ' + error);
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const cart = this.cartDao.get(cid);
      const productExists = this.productDao.getById(pid);
      if (!cart) {
        return Promise.reject('El carro no existe');
      } else if (!productExists) {
        return Promise.reject('El producto no existe');
      }
      const product = {
        id: pid,
        quantity: 1,
      };

      return await this.cartDao.addProduct(cid, product);
    } catch (error) {}
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      return this.cartDao.deleteItem(cid, pid);
    } catch (error) {
      return Promise.reject('Error al eliminar producto ' + error);
    }
  };

  updateCart = async (cid, products) => {
    try {
      const cart = await this.cartDao.get(cid);
      if (!cart) {
        return Promise.reject('El carro no existe');
      }

      products.forEach((product) => {
        const productExists = this.productDao.getById(product.productId);
        if (!productExists) {
          return Promise.reject(
            `El producto con id ${product.productId} no existe`
          );
        }
      });

      return await this.cartDao.updateCart(cid, products);
    } catch (error) {
      return Promise.reject('Error al actualizar el carro: ' + error);
    }
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    try {
      const cart = await this.cartDao.get(cid);
      const productExists = await this.productDao.getById(pid);
      if (!cart) {
        return Promise.reject('El carro no existe');
      } else if (!productExists) {
        return Promise.reject('El producto no existe');
      }

      const product = {
        id: pid,
        quantity: quantity,
      };

      return await this.cartDao.updateProductQuantity(cid, product);
    } catch (error) {
      return Promise.reject('Error ' + error);
    }
  };

  deleteAllProductsFromCart = async (cid) => {
    try {
      return this.cartDao.delete(cid);
    } catch (error) {
      return Promise.reject(
        'Error al borrar los productos del carro ' + error
      );
    }
  };
}
