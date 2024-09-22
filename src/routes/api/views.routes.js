import express from 'express';
import { passportCall } from '../../utils.js';
import ViewsController from '../../controllers/views.controller.js';

const {
  renderInicio,
  renderChat,
  renderLogin,
  renderRegister,
  renderRestore,
  renderCurrent,
  renderProducts,
  renderCart,
} = new ViewsController();

const router = express.Router();

router.get('/', renderInicio);

router.get('/chat', renderChat);

router.get('/login', renderLogin);

router.get('/register', renderRegister);

router.get('/restore', renderRestore);

router.get('/current', passportCall('jwt'), renderCurrent);

router.get('/products', passportCall('jwt'), renderProducts);

router.get('/carts/:cid', passportCall('jwt'), renderCart);

export default router;
