import { verifyAccessToken } from '../utils/jwt.utils.js';

export default (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    verifyAccessToken(token, (err, payload) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.user = payload;
        req.token = token;
        next();
    });
}
