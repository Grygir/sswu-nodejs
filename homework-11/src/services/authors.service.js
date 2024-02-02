import models from '../models/index.js';

const {Author} = models;

export const getAllAuthors = async ({offset = 0, ...options}) => {
    const {count, rows} = await Author.findAndCountAll({
        where: options,
        limit: 10,
        offset
    });

    return {
        authors: rows,
        authorsCount: count
    }
};

export const createAuthor = async (data) => {
     return Author.create(data);
};

export const getAuthorById = async (authorId) => {
    return Author.findByPk(authorId);
};

export const updateAuthor = async (authorId, data) => {
    return Author.update(data, { where: { id: authorId } });
};

export const deleteAuthor = async (authorId) => {
    return Author.destroy({ where: { id: authorId } });
}
