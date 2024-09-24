import { Router } from 'express';
import { CartController } from '../controllers/carts.controller.js';
import { ProductController } from '../controllers/products.controller.js';
import { UserController } from '../controllers/users.controller.js';
import { ViewsController } from '../controllers/views.controller.js'
import { TicketController } from '../controllers/tickets.controller.js'
import utils from '../utils.js';
import upload from '../middlewares/upload.js';

const { passportCall } = utils;
const DashboardRouter = Router()

const {
    getCarts,
    getCartById,
} = new CartController();

const {
    getDashProducts,
    deleteProduct,
    updateProduct,
} = new ProductController();

const {
    getDashUsers,
    isAdmin,
} = new UserController();

const {
    renderAdmin,
} = new ViewsController

const {
    getTickets,
} = new TicketController

DashboardRouter.get('/', passportCall('login', 'admin'), isAdmin, renderAdmin);

DashboardRouter.get('/users', passportCall('login', 'admin'), isAdmin, getDashUsers);

DashboardRouter.get('/products', passportCall('login', 'admin'), isAdmin, getDashProducts);

DashboardRouter.delete('/products/delete/:pid', passportCall('login', 'admin'), isAdmin, deleteProduct);

DashboardRouter.get('/tickets', passportCall('login', 'admin'), isAdmin, getTickets);

DashboardRouter.put('/products/update/:pid', upload.single('thumbnail'), passportCall('login', 'admin'), isAdmin, updateProduct);


export default DashboardRouter;  