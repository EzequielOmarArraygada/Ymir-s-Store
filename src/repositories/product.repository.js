import productModel from '../dao/models/product.model.js';

export class ProductRepository {
    constructor(){
        this.model = productModel;
    }
    
    async getProducts(page, limit, sortOrder, category, status) {
        try {
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: sortOrder ? { price: sortOrder === 'asc' ? 1 : -1 } : null,
                lean: true
            };

            const query = category ? { category: category } : {};
            const queryStatus = status ? { status: status } : {};

            return await this.model.paginate({ ...query, ...queryStatus }, options);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    async getProductById(pid){
        try {
            return await this.model.findById(pid).lean(); 
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${pid}:`, error);
            throw error;
        }
    }
    
    async addProduct(newProduct){
        try {
            return await this.model.create(newProduct);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }
    
    async updateProduct(pid, updatedProduct){
        try {
            return await this.model.findByIdAndUpdate(pid, updatedProduct, { new: true });
        } catch (error) {
            console.error(`Error al actualizar el producto con ID ${pid}:`, error);
            throw error;
        }
    }
    
    async deleteProduct(pid){
        try {
            return await this.model.findByIdAndDelete(pid);
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${pid}:`, error);
            throw error;
        }
    }

    async findUserByProductId(pid) {
        try {
            const product = await this.model.findById(pid).populate('owner');
            return product ? product.owner : null;
        } catch (error) {
            console.error(`Error al buscar usuario por ID de producto ${pid}:`, error);
            throw error;
        }
    }
    
}
