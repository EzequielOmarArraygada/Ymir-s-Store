import { Router } from 'express';
import { MessageController } from '../controllers/messages.controller.js'
import utils from '../utils.js';

const { passportCall } = utils;


const companyRouter = Router()

const {
  postMessage,
  getViewMessage,
} = new MessageController();

companyRouter.get('/about', passportCall('login', 'user'), (req, res) => {
  try {
    let cartId = null;
    if (req.isAuthenticated()) {
      const user = req.user;
      cartId = user.cart ? user.cart : null;
    }
    res.render('about', { user: req.user, cartId });
  } catch (error) {
    res.status(500).send({ error: 'Ocurrió un error.' });
  }
});

companyRouter.get('/contactus', passportCall('login', 'user'), getViewMessage);

companyRouter.post('/contactus', postMessage)

companyRouter.get('/faq', passportCall('login', 'user'), (req, res) => {
  try {
    let cartId = null;
    if (req.isAuthenticated()) {
      const user = req.user;
      cartId = user.cart ? user.cart : null;
    }
    res.render('faq', { user: req.user, cartId });
  } catch (error) {
    res.status(500).send({ error: 'Ocurrió un error.' });
  }
});


export default companyRouter;
