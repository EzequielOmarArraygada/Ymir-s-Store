import { Router } from 'express';

const companyRouter = Router()

companyRouter.get('/about', (req, res) => {
    res.render('about');
  });

  companyRouter.get('/contactus', (req, res) => {
    res.render('contactUs');
  });
  
export default companyRouter;
