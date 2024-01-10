import express from 'express';
import booksRouter from './routes/books.route.js';
import errorHandler from './middleware/error-handler.middleware.js';
import accessLogHandler from './middleware/access-log-handler.middleware.js';

const app = express();

app.use(accessLogHandler({logger: console.log}));
app.use(express.json());
app.use('/books', booksRouter);
app.use(errorHandler({error: console.error}));

export default app;
