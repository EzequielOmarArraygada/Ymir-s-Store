import { Router } from 'express';
import { CartController } from '../controllers/carts.controller.js';
import { ProductController } from '../controllers/products.controller.js';
import { UserController } from '../controllers/users.controller.js';
import { ViewsController } from '../controllers/views.controller.js'
import { TicketController } from '../controllers/tickets.controller.js'
import { MessageController } from '../controllers/messages.controller.js'
import utils from '../utils.js';
import upload from '../middlewares/upload.js';
import passport from 'passport';


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
    addProduct,
} = new ProductController();

const {
    getDashUsers,
    isAdmin,
    postSignupDash,
    updateUser,
    deleteUser
} = new UserController();

const {
    renderAdmin,
} = new ViewsController

const {
    updateMessageStatus,
    getMessageDetails,
    getMessages,
    sendReply
} = new MessageController

const {
    getTickets,
    updateStatus,
    getTicketDetails,
} = new TicketController

DashboardRouter.get('/', passportCall('login', 'admin'), isAdmin, renderAdmin);

DashboardRouter.get('/users', passportCall('login', 'admin'), isAdmin, getDashUsers);

DashboardRouter.get('/products', passportCall('login', 'admin'), isAdmin, getDashProducts);

DashboardRouter.delete('/products/delete/:pid', passportCall('login', 'admin'), isAdmin, deleteProduct);

DashboardRouter.get('/tickets', passportCall('login', 'admin'), isAdmin, getTickets);

DashboardRouter.put('/products/update/:pid', upload.single('thumbnail'), passportCall('login', 'admin'), isAdmin, updateProduct);

DashboardRouter.post('/products/add', upload.single('thumbnail'), passportCall('login', 'admin'), isAdmin, addProduct);

DashboardRouter.post('/users/add', passport.authenticate('signup', { 
    failureRedirect: '/failregister', 
    failureMessage: true 
}), postSignupDash);

DashboardRouter.put('/users/update/:uid', upload.single('profileImage'), passportCall('login', 'admin'), isAdmin, updateUser);

DashboardRouter.delete('/users/delete/:uid', passportCall('login', 'admin'), isAdmin, deleteUser);

DashboardRouter.get('/tickets/details/:tid', passportCall('login', 'admin'), isAdmin, getTicketDetails);

DashboardRouter.post('/tickets/details/updateStatus', passportCall('login', 'admin'), isAdmin, updateStatus);

DashboardRouter.get('/messages', passportCall('login', 'admin'), isAdmin, getMessages);

DashboardRouter.get('/messages/details/:mid', passportCall('login', 'admin'), isAdmin, getMessageDetails);

DashboardRouter.post('/messages/details/updateMessageStatus', passportCall('login', 'admin'), isAdmin, updateMessageStatus);

DashboardRouter.post('/messages/send-reply', passportCall('login', 'admin'), isAdmin, sendReply);

export default DashboardRouter;    

