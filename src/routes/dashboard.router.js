import { Router } from 'express';
import { CartController } from '../controllers/carts.controller.js';
import { ProductController } from '../controllers/products.controller.js';
import { UserController } from '../controllers/users.controller.js';
import { ViewsController } from '../controllers/views.controller.js'
import { TicketController } from '../controllers/tickets.controller.js'
import utils from '../utils.js';

const { passportCall } = utils;
const DashboardRouter = Router()

const {
    getCarts,
    getCartById,
} = new CartController();

const {
    getAllProducts,
} = new ProductController();

const {
    getAllUsers,
    isAdmin,
} = new UserController();

const {
    renderAdmin,
} = new ViewsController

const {
    getTickets,
} = new TicketController

DashboardRouter.get('/', passportCall('login', 'admin'), isAdmin, renderAdmin);

DashboardRouter.get('/users', passportCall('login', 'admin'), isAdmin, getAllUsers);

// DashboardRouter.get('/products', passportCall('login', 'admin'), isAdmin, getAllProducts);

DashboardRouter.get('/tickets', passportCall('login', 'admin'), isAdmin, getTickets);

export default DashboardRouter;