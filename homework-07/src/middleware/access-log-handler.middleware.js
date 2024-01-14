const accessLogHandler = ({logger}) => (req, res, next) => {
    const reqDate = new Date();
    res.on('finish', () => {
        const respDate = new Date();
        const row = [reqDate.toISOString(), req.method, req.originalUrl, res.statusCode, respDate.toISOString()];
        logger(row.join('\t'));
    });
    next();
}

export default accessLogHandler
