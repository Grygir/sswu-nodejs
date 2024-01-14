const errorHandler = ({error}) => (err, req, res, next) => {
    if (err) {
        if (!res.headersSent) {
            res.sendStatus(500);
        }
        error(err);
    }
}

export default errorHandler
