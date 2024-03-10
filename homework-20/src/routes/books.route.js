import express from 'express';
import * as booksController from '../controller/books.controller.js';

const router = express.Router();

router.get('/', booksController.getBooks);
router.post('/', booksController.createBook);
router.all('/', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

router.get('/:id', booksController.getBookById);
router.all('/:id', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

export default router;
