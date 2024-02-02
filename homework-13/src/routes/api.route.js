import express from 'express';
import actionsRouter from './actions.route.js';
import booksRouter from './books.route.js';
import recommendationsRouter from './recommendations.route.js';
import openApiValidatorMiddleware from "../middleware/openapi-validator.middleware.js";

const router = express.Router();

router.use(express.json());
router.use(openApiValidatorMiddleware);
router.use('/actions', actionsRouter);
router.use('/books', booksRouter);
router.use('/recommendations', recommendationsRouter);

export default router;
