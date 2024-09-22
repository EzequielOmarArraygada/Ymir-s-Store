import { Router } from 'express';
import { CartController } from '../controllers/carts.controller.js';
import { ProductController } from '../controllers/products.controller.js';
import { UserController } from '../controllers/users.controller.js';
import utils from '../utils.js';

const { passportCall } = utils;
const dashborardRouter = Router()

const {
    getCarts,
    getCartById
} = new CartController();

const {
    getAllProducts,
    
} = new ProductController();