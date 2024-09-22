import express from 'express';
import faker from 'faker';

const router = express.Router();

router.get('/mockingproducts', (req, res) => {
  const products = Array.from({ length: 100 }, () => ({
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
  }));
  res.json(products);
});

export default router;