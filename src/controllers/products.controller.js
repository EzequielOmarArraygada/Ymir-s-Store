import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import CustomError from '../services/errors/CustomError.js';
import EError from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info-products.js';
import { sendEmail } from '../services/mailing.js';


export class ProductController {
    constructor(){
        this.productsService = new ProductManagerMongo();
    }

    getHome = (req, res) => {
        res.redirect('/products?page=1');
    }
    
    getLogin = (req, res) => {
        res.render('login');
    }
  
    getSignup = (req, res) => {
        res.render('signup');
    }

    getProducts = async (req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 12;
            const sortOrder = req.query.sort ? req.query.sort : null;
            const category = req.query.category ? req.query.category : null;
            const searchQuery = req.query.search ? req.query.search : null;
            const status = req.query.status ? req.query.status : null;
    
            let cartId = null;
            if (req.isAuthenticated()) {
                const user = req.user;
                cartId = user.cart ? user.cart : null;
            }
    
            // Lógica de filtrado
            const filter = {};
            if (category) filter.category = category;
            if (status) filter.status = status;
            if (searchQuery) filter.title = { $regex: searchQuery, $options: 'i' }; // Búsqueda por nombre
    
            // Obtener productos con los filtros y ordenación
            const result = await this.productsService.getProducts(page, limit, sortOrder, category, status, filter);
    
            const availableProducts = result.docs.filter(product => product.stock > 0);
    
            result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages);
    
            res.render('products', { user: req.user, products: availableProducts, cartId, ...result });
    
        } catch (error) {
            req.logger.error(
                `Error al obtener los productos: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al obtener los productos.' });
        }
    }

    getDashProducts = async (req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 12;
            const sortOrder = req.query.sort ? req.query.sort : null;
            const category = req.query.category ? req.query.category : null;
            const status = req.query.status ? req.query.status : null;

            const result = await this.productsService.getProducts(page, limit, sortOrder, category, status);

            result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages);

            res.render('adminProducts', { products: result.docs, ...result });

        } catch (error) {
            req.logger.error(
                `Error al obtener los productos: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al obtener los productos.' });
        }
    }    
    
    getProductById = async (req, res) => {
        try {
            let { pid } = req.params;
            let result = await this.productsService.getProduct(pid);
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al obtener el producto por ID: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al obtener el producto.' });
        }
    }

    getProductDetails = async (req, res) => {
        try {
            let cartId = null;
            if (req.isAuthenticated()) {
                const user = req.user;
                cartId = user.cart ? user.cart : null;
            }
            let { pid } = req.params;
            let product = await this.productsService.getProduct(pid);
            res.render('productDetails', { product, user: req.user, cartId });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los detalles del producto');
        }
    };
    
    addProduct = async (req, res, next) => {
        try {
            let { title, description, price, thumbnail, code, stock, category, status } = req.body;
            const user = req.user; 

            if (user.role !== 'premium' && user.role !== 'admin') {
                return res.status(403).send('Solo los usuarios premium pueden agregar productos.');
            }

            if (!title || !description || !price || !code || !stock || !category ) {
                const err = new CustomError(
                    'Error al crear el producto',
                    generateErrorInfo({ title, description, price, code, stock, category }),
                    'Error al intentar crear el producto',
                    EError.INVALID_TYPES_ERROR
                );
                return next(err);
            }
            
            if (req.file) {
                thumbnail = `/public/assets/${req.file.filename}`; 
            }

            const result = await this.productsService.addProduct({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status,
                owner: user._id, 
            });

            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al agregar el producto: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Error interno del servidor.' });
        }
    }
    
    updateProduct = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const updatedData = req.body;
            if (req.file) {
                updatedData.thumbnail = `/public/assets/${req.file.filename}`; 
            }
            const result = await this.productsService.updateProduct(pid, updatedData);
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(`Error al actualizar el producto: ${error.message}`);
            res.status(500).send({ error: 'Error al actualizar el producto.' });
        }
    };
    

    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await this.productsService.getProduct(pid);
    
            if (!product) {
                return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
            }
    
            const user = req.user; // Usuario logueado (admin)
    
            // Permitir eliminación si el usuario es admin o dueño del producto
            if (user.role === 'admin' || product.owner.toString() === user._id.toString()) {
                await this.productsService.deleteProduct(pid);
    
                // Enviar correo al admin que eliminó el producto
                await sendEmail({
                    to: user.email,
                    subject: 'Producto eliminado',
                    text: `Has eliminado el producto con ID ${pid}.`
                });
    
                req.logger.info(`Correo enviado a ${user.email} sobre la eliminación del producto ${pid}`);
                
                res.send({ status: 'success', message: 'Producto eliminado exitosamente' });
            } else {
                // En caso de que el usuario no sea admin ni dueño del producto
                res.status(403).send({ status: 'error', message: 'No tienes permiso para eliminar este producto.' });
            }
        } catch (error) {
            req.logger.error(`Error al eliminar producto: ${error.message}, ${req.method} en ${req.url}`);
            res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
        }
    };
    
}
