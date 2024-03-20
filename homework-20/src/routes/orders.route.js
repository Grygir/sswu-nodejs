import express from 'express';
import * as ordersController from '../controller/orders.controller.js';
import jwtAuth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', jwtAuth, ordersController.getUserOrders);
router.post('/', jwtAuth, ordersController.createOrder);
router.all('/', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

router.get('/:id', jwtAuth, ordersController.getOrderById);
router.post('/:id', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(501);
    }
});
router.patch('/:id', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(501);
    }
});
router.all('/:id', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

export default router;
