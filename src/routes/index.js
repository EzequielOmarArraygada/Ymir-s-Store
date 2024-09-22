import { Router } from 'express';
import ProductsRouter from './products.router.js';
import cartRouter from './carts.router.js';
import usersRouter from './users.router.js';
import { chatRouter } from './chat.router.js';
import MockRouter from './mock.router.js';

const router = Router()

router.use('/api/sessions', usersRouter);
router.use('/', ProductsRouter);
router.use('/api/carts', cartRouter);
router.use('/api/chat', chatRouter);
router.use('/api/mockingproducts', MockRouter);

export default router