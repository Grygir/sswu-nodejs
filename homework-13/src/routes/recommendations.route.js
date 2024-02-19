import express from 'express';
import * as booksController from '../controller/books.controller.js';

const router = express.Router();

router.all('/', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

router.get('/:userId', booksController.getBookRecommendationsByUserId);
router.all('/:id', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

export default router;
