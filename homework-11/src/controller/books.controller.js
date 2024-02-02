import * as booksService from '../services/books.service.js';

export const getBooks = async (req, res, next) => {
    let books;
    try {
        books = await booksService.getAllBooks(req.query);
    } catch (err) {
        return next(err);
    }

    res.status(200).json(books);
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

    let book;
    try {
        book = await booksService.createBook(data);
    } catch (err) {
        return next(err);
    }

    res.location(`${req.baseUrl}/${book.id}`);
    res.status(201).json(book);
};

export const getBookByAuthorId = async (req, res, next) => {
    let books;
    try {
        books = await booksService.getBooksByAuthorId(req.params.id);
    } catch (err) {
        return next(err);
    }

    res.status(200).json(books);
};
