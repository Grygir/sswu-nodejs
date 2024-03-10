import models from '../models/index.js';

const {Order, OrderBook, Book, sequelize} = models;

const getOrderExtendedQuery = () => {
    return {
        attributes: {
            exclude: ['userId']
        },
        include: [{
            model: OrderBook,
            as: 'orderBooks',
            attributes: {
                exclude: ['id', 'bookId'],
            },
            include: [{
                model: Book,
                as: 'book',
                attributes: ['id', 'title']
            }]
        }],
    }
}

export const getUserOrders = async ({offset = 0, ...where}) => {
    const {rows, count} = await Order.findAndCountAll({
        ...getOrderExtendedQuery(),
        where,
        limit: 10,
        offset
    });

    return { orders: rows, ordersCount: count }
};

export const getOrderById = async (orderId, where) => {
    return await Order.findOne({
        ...getOrderExtendedQuery(),
        where: {
            ...where,
            id: orderId
        }
    });
};

export const createOrder = async (data) => {
    data.orderBooks = data.orderBooks.reduce((result, item) => {
        // combine quantity for unique books
        const existingItem = result.find(_item => item.bookId === _item.bookId)
        if (existingItem) {
            existingItem.quantity += item.quantity
        } else {
            result.push(item)
        }
        return result
    }, []);

    return await sequelize.transaction(async transaction => {
        const order = await Order.create(data, {
            transaction,
            include: [{
                model: OrderBook,
                as: 'orderBooks'
            }]
        });

        await order.reload({
            transaction,
            ...getOrderExtendedQuery(),
        })

        for(const orderBook of order.orderBooks) {
            const stock = await orderBook.book.getStock()
            await stock.decrement({quantity: orderBook.quantity}, {transaction});
        }

        return order;
    });
};
