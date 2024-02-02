import express from 'express';
import apiRouter from './routes/api.route.js';
import swaggerRouter from './routes/swagger.route.js';
import errorHandler from './middleware/error-handler.middleware.js';
import accessLogHandler from './middleware/access-log-handler.middleware.js';
import mongoose from 'mongoose';

import dbConfig from './config/db.config.js';

mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbname}`)
    .then(() => console.log('Connected to DB'))
    .catch(e => console.error(e));

mongoose.set('debug', true);

const app = express();

app.use(accessLogHandler({logger: console.log}));
app.use('/api', apiRouter);
app.use('/api-docs', swaggerRouter);
app.use(errorHandler({error: console.error}));

export default app;
