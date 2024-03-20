import models from '../models/index.js';

const {Order, OrderBook, Book, Author, Genre, sequelize} = models;

const getOrderExtendedQuery = () => {
    return {
        include: [{
            model: OrderBook,
            as: 'orderBooks',
            attributes: {
                exclude: ['id', 'bookId'],
            },
            include: [{
                model: Book,
                as: 'book',
                attributes: {
                    exclude: ['price', 'year'],
                    include: [
                        'id',
                        'title',
                        [sequelize.fn('json_agg', sequelize.fn('DISTINCT', sequelize.col('orderBooks.book.genres.name'))), 'genresList'],
                        [sequelize.fn('json_agg', sequelize.fn('DISTINCT', sequelize.col('orderBooks.book.authors.name'))), 'authorsList'],
                    ]
                },
                include: [{
                    model: Author,
                    as: 'authors',
                    through: {attributes: []},
                    attributes: []
                }, {
                    model: Genre,
                    as: 'genres',
                    through: {attributes: []},
                    attributes: []
                }]
            }]
        }],
        group: ['Order.id', 'orderBooks.id', 'orderBooks.book.id'],
        subQuery: false,
    }
}

export const getUserOrders = async ({offset = 0, ...where}) => {
    const orders = await Order.findAll({
        ...getOrderExtendedQuery(),
        where,
        limit: 10,
        offset
    });

    const ordersCount = await Order.count({
        where,
        limit: 10,
        offset
    })

    return { orders, ordersCount }
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

    return sequelize.transaction(async transaction => {
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
