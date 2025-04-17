import { Router } from 'express';
import { MessageController } from '../controllers/messages.controller.js'


const companyRouter = Router()

const {
  postMessage,
} = new MessageController();

companyRouter.get('/about', (req, res) => {
    res.render('about');
  });

  companyRouter.get('/contactus', (req, res) => {
    res.render('contactUs');
  });

  companyRouter.post('/contactus', postMessage)
  
export default companyRouter;
