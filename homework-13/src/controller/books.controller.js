import * as booksService from '../services/books.service.js';

export const addAction = async (req, res, next) => {
    const data = req.body;
    let action;
    try {
        action = await booksService.addAction(data);
    } catch (err) {
        return next(err);
    }

    res.status(200).json(action);
};

export const getBooks = async (req, res, next) => {
    let books;
    try {
        books = await booksService.getSortedBooks(req.query.sortBy);
    } catch (err) {
        return next(err);
    }

    res.status(200).json(books);
};

export const getBookRecommendationsByUserId = async (req, res, next) => {
    let books;
    try {
        books = await booksService.recommendBooks(req.params.userId);
    } catch (err) {
        return next(err);
    }

    res.status(200).json(books);
}
