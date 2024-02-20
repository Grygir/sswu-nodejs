import * as authorsService from '../services/authors.service.js';

export const getAuthors = async (req, res, next) => {
    let authors;
    try {
        authors = await authorsService.getAllAuthors(req.query);
    } catch (err) {
        return next(err);
    }

    res.status(200).json(authors);
};

export const createAuthor = async (req, res, next) => {
    const data = req.body;

    let author;
    try {
        author = await authorsService.createAuthor(data);
    } catch (err) {
        return next(err);
    }

    res.location(`${req.baseUrl}/${author.id}`);
    res.status(201).json(author);
};

export const getAuthorById = async (req, res, next) => {
    let author;
    try {
        author = await authorsService.getAuthorById(req.params.id);
    } catch (err) {
        return next(err);
    }

    if (author) {
        res.status(200).json(author);
    } else {
        res.sendStatus(404);
    }
};

export const updateAuthor = async (req, res, next) => {
    const data = req.body;

    let updated;
    try {
        [updated] = await authorsService.updateAuthor(req.params.id, data);
    } catch (err) {
        return next(err);
    }

    if (updated) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
};

export const deleteAuthor = async  (req, res, next) => {
    let result;
    try {
        result = await authorsService.deleteAuthor(req.params.id);
    } catch (err) {
        return next(err);
    }

    if (result) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
};
