import express from 'express';
import * as authorsController from '../controller/authors.controller.js';
import * as booksController from '../controller/books.controller.js';

const router = express.Router();

router.get('/', authorsController.getAuthors);
router.post('/', authorsController.createAuthor);
router.all('/', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

router.get('/:id', authorsController.getAuthorById);
router.patch('/:id', authorsController.updateAuthor);
router.delete('/:id', authorsController.deleteAuthor);
router.all('/:id', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

router.get('/:id/books', booksController.getBookByAuthorId);
router.all('/:id/books', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

export default router;
