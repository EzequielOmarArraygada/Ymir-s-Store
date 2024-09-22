import { Router } from 'express';
import ProductsRouter from './products.router.js';
import cartRouter from './carts.router.js';
import usersRouter from './users.router.js';
import DashboardRouter from './dashboard.router.js'

const router = Router()

router.use('/api/sessions', usersRouter);
router.use('/', ProductsRouter);
router.use('/api/carts', cartRouter);
router.use('/admin', DashboardRouter);



export default router