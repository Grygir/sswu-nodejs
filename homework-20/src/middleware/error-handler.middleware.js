export default ({error}) => (err, req, res, next) => {
    if (err) {
        if (!res.headersSent) {
            res.status(err.status || 500).send(err.message || 'Internal server error');
        }
        error(err);
    }
};
