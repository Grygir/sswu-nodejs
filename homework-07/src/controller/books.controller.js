import * as booksService from '../services/books.service.js';
import * as booksValidator from "../utils/books.validator.js";

export const getBooks = async (req, res, next) => {
    let books;
    try {
        books = await booksService.getAllBooks();
    } catch (err) {
        return next(err);
    }

    res.status(200).json({
        books,
        booksCount: books.length
    });
};

export const getBookById = async (req, res, next) => {
    let book;
    try {
        book = await booksService.getBookById(req.params.id);
    } catch (err) {
        return next(err);
    }

    if (book) {
        res.status(200).json(book);
    } else {
        res.sendStatus(404);
    }
};

export const createBook = async (req, res, next) => {
    const data = req.body;

    const errors = booksValidator.validateCreateData(data);
    if (errors.length) {
        return res.status(400).json({
            status: false,
            errors,
        });
    }

    let book;
    try {
        book = await booksService.createBook(data);
    } catch (err) {
        return next(err);
    }

    res.location(`${req.baseUrl}/${book.id}`);
    res.status(200).json(book);
};

export const updateBook = async (req, res, next) => {
    const data = req.body;

    const errors = booksValidator.validateUpdateData(data);
    if (errors.length) {
        return res.status(400).json({
            status: false,
            errors,
        });
    }

    let book;
    try {
        book = await booksService.updateBook(req.params.id, data);
    } catch (err) {
        return next(err);
    }

    if (book) {
        res.location(`${req.baseUrl}/${book.id}`);
        res.status(200).json(book);
    } else {
        res.sendStatus(404);
    }
};

export const deleteBook = async  (req, res, next) => {
    let result;
    try {
        result = await booksService.deleteBook(req.params.id);
    } catch (err) {
        return next(err);
    }

    if (result) {
        res.sendStatus(201);
    } else {
        res.sendStatus(404);
    }

};
