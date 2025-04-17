import { Router } from 'express';

const companyRouter = Router()

companyRouter.get('/about', (req, res) => {
    res.render('about');
  });
  
export default companyRouter;
