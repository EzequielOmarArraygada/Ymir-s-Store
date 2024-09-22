import express from 'express';
import { generateProducts } from '../utils-mock.js';

const MockRouter = express.Router()

MockRouter.get('/', async (req, res) => {
    try {
        req.logger.debug(
            `probando..., ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        )
        let productsMock = [];
        for (let i = 0; i < 100; i++) {
            productsMock.push(generateProducts());   
        }
        req.logger.debug(
            `Datos de prueba creados: ${productsMock}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        )
        res.send({ status: 'success', payload: productsMock});
    } catch (error) {
        req.logger.error(
            `Error al crear datos de prueba: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        )
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});

export default MockRouter;