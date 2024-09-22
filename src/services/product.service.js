import ProductDao from '../dao/productDao.js';

export default class ProductService {
  constructor() {
    this.dao = new ProductDao();
  }

  getProducts = async (params) => {
    const filter = {};
    if (params.status) filter.status = params.status;
    if (params.category) filter.category = params.category;
    const options = {
      limit: params.limit,
      page: params.page,
      lean: true,
    };
    if (params.sort) options.sort = { price: params.sort };

    try {
      return await this.dao.gets(filter, options);
    } catch (error) {
      return Promise.reject('Error al obtener los productos: ' + error);
    }
  };

  createProduct = async (newProduct) => {
    let productDB = await this.dao.getByCode(newProduct.code);
    if (productDB) {
      return Promise.reject(
        `El producto con el código '${newProduct.code}' ya existe, no se agregará a la base de datos'.`
      );
    }

    try {
      return await this.dao.create(newProduct);
    } catch (error) {
      return Promise.reject('Error al crear el producto en la BD: ' + error);
    }
  };

  getProductById = async (id) => {
    try {
      return await this.dao.getById(id);
    } catch (error) {
      return Promise.reject(`Error al obtener el producto: ` + error);
    }
  };

  updateProduct = async (id, productUpdated) => {
    try {
      return await this.dao.update(id, productUpdated);
    } catch (error) {
      return Promise.reject('Error al actualizar el producto: ' + error);
    }
  };

  deleteProduct = async (id) => {
    try {
      return await this.dao.delete(id);
    } catch (error) {
      return Promise.reject('Error al eliminar el producto: ' + error);
    }
  };
}
