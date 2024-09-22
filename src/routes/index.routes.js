import { Router } from 'express';
import cartRoutes from './api/cart.routes.js';
import productRoutes from './api/product.routes.js';
import sessionRoutes from './api/sessions.routes.js';
import viewsRoutes from './api/views.routes.js';

const router = Router();

router.use('/api/products', productRoutes);
router.use('/api/carts', cartRoutes);
router.use('/api/sessions', sessionRoutes);
router.use('/', viewsRoutes);
router.use('*', (req, res) => {
  res.status(404).send('Not found');
});

export default router;
