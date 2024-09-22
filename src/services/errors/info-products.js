import ProductModel from '../../dao/models/product.model.js'

const product = new ProductModel();

export const generateErrorInfo = (product) => {

    return `Una o más propiedades estaban incompletas o inválidas. Lista de propiedades requeridas:
    *title: necesita un string, se recibió ${product.title}
    *description: necesita un string, se recibió ${product.description}
    *price: necesita un number, se recibió ${product.price}
    *imagen: necesita un string, se recibió ${product.thumbnail}
    *code: necesita un number, se recibió ${product.code}
    *stock: necesita un number, se recibió ${product.stock}
    *category: necesita un string, se recibió ${product.category}
    *status: necesita un string, se recibió ${product.status}
    `
}
