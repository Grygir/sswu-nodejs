import * as ordersService from '../services/orders.service.js';

export const getUserOrders = async (req, res, next) => {
    let orders;
    try {
        orders = await ordersService.getUserOrders({ ...req.query, userId: req.user.id });
    } catch (err) {
        return next(err);
    }

    res.status(200).json(orders);
};

export const getOrderById = async (req, res, next) => {
    let order;
    try {
        order = await ordersService.getOrderById(req.params.id, { userId: req.user.id });
    } catch (err) {
        return next(err);
    }

    if (order) {
        res.status(200).json(order);
    } else {
        res.sendStatus(404);
    }
};

export const createOrder = async (req, res, next) => {
    const data = req.body;

    let order;
    try {
        order = await ordersService.createOrder({ ...data, userId: req.user.id });
        // @todo call actions
    } catch (err) {
        if (err.message.indexOf('"stock" violates check constraint') !== -1) {
            res.status(400).send('Request book is out of stock');
            return res;
        }
        return next(err);
    }

    res.location(`${req.baseUrl}/${order.id}`);
    res.status(201).json(order);
};
