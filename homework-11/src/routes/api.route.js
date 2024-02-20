import express from 'express';
import booksRouter from './books.route.js';
import authorsRouter from './authors.route.js';
import openApiValidatorMiddleware from "../middleware/openapi-validator.middleware.js";

const router = express.Router();

router.use(express.json());
router.use(openApiValidatorMiddleware);
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);

export default router;
