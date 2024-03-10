import models from '../models/index.js';

const {Book, Review, Author, BookAuthor, sequelize, Sequelize} = models;

const getBookExtendedQuery = () => {
    return {
        include: [{
            model: Author,
            as: 'authors',
            through: {attributes: []},
            attributes: []
        }, {
            model: Review,
            as: 'reviews',
            attributes: []
        }],
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
            include: [
                [sequelize.fn('json_agg', sequelize.fn('DISTINCT', sequelize.col('authors.name'))), 'authorsList'],
                [sequelize.cast(sequelize
                    .fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('reviews.id'))), 'INTEGER'), 'totalReviews'],
                [sequelize.cast(sequelize
                    .fn('round', sequelize.fn('AVG', sequelize.col('reviews.rating')), 1), 'FLOAT'), 'rating']
            ]
        },
        group: ['Book.id'],
        subQuery:false,
    };
}

export const getAllBooks = async ({offset = 0, ...options}) => {
    const booksCount = await Book.count({
        where: options,
        limit: 10,
        offset
    })

    const books = await Book.findAll({
        where: options,
        ...getBookExtendedQuery(),
        limit: 10,
        offset
    });

    return { books, booksCount }
};

export const getBookById = async (bookId) => {
    return await Book.findByPk(bookId, {
        ...getBookExtendedQuery()
    });
};

export const createBook = async (data) => {
    const book = await sequelize.transaction(async transaction => {
        const result = await Promise.all(
            data.authors
                .map(author => Author.findOrCreate({where: author, transaction}))
        );
        const authors = result
            .map(([author]) => author)
            .filter((author, i, list) => list.findIndex(item => item.id === author.id) === i);

        delete data.authors;

        const book = await Book.create(data, {
            include: [{
                model: Review,
                as: 'reviews'
            }],
            transaction
        });

        await book.setAuthors(authors, { transaction });
        return book;
    });

    return await getBookById(book.id);
};

export const getBooksByAuthorId = async (authorId) => {
    const { include, ...restBookExtendedQuery } = getBookExtendedQuery();

    return await Book.findAll({
        include: [
            ...include,
            {
                model: BookAuthor,
                as: 'authorIds',
                required: true,
                attributes: [],
                where: {
                    authorId: {[Sequelize.Op.eq]: authorId }
                }
            }
        ],
        ...restBookExtendedQuery
    });
};
