import { ProductRepository } from '../../../repositories/product.repository.js';

export class ProductManagerMongo {
    constructor(){
        this.repository = new ProductRepository();
    }
    
    async getProducts(page, limit, sortOrder, category, status) {
        return await this.repository.getProducts(page, limit, sortOrder, category, status);
    }
    
    async getProduct(pid){
        return await this.repository.getProductById(pid);
    }
    
    async addProduct(newProduct){
        return await this.repository.addProduct(newProduct);
    }
    
    async updateProduct(pid, updatedProduct){
        return await this.repository.updateProduct(pid, updatedProduct);
    }
    
    async deleteProduct(pid){
        return await this.repository.deleteProduct(pid);
    }

    async findUserByProductId(pid) {
        return await this.repository.findUserByProductId(pid);
    }
    
}
