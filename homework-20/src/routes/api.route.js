import express from 'express';
import booksRouter from './books.route.js';
import authorsRouter from './authors.route.js';
import usersRouter from './users.route.js';
import openApiValidatorMiddleware from '../middleware/openapi-validator.middleware.js';
import * as secureController from '../controller/secure.controller.js';
import jwtAuth from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(express.json());
router.use(openApiValidatorMiddleware);
router.use('/users',  usersRouter);
router.post('/login', secureController.login)
router.post('/logout', jwtAuth, secureController.logout)
router.post('/token', secureController.token)
router.use('/books', booksRouter);
router.use('/authors', authorsRouter);

export default router;
