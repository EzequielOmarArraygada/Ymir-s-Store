import productModel from './models/product.model.js';


export default class ProductDao {
  constructor() {
    this.model = productModel;
  }


  async gets(filter, options) {
    return await this.model.paginate(filter, options);
  }


  async getById(id) {
    return await this.model.findById(id);
  }


  async getByCode(code) {
    return await this.model.findOne({ code: code });
  }


  async create(newProduct) {
    return await this.model.create(newProduct);
  }


  async update(id, productToUpdate) {

    return this.model.findByIdAndUpdate({ _id: id }, productToUpdate, {
      new: true,
    });
  }


  async delete(id) {
    return await this.model.findByIdAndUpdate(
      { _id: id },
      { status: false },
      { new: true }
    );
  }
}
