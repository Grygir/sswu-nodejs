import express from 'express';
import apiRouter from './routes/api.route.js';
import swaggerRouter from './routes/swagger.route.js';
import errorHandler from './middleware/error-handler.middleware.js';
import accessLogHandler from './middleware/access-log-handler.middleware.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('./models');

db.sequelize.authenticate()
    .then(() => console.log('connected to DB'))
    .catch((e) => console.log('fail to connect to DB', e));

const app = express();

app.use(accessLogHandler({logger: console.log}));
app.use('/api', apiRouter);
app.use('/api-docs', swaggerRouter);
app.use(errorHandler({error: console.error}));

export default app;
