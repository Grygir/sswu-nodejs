import * as usersService from '../services/users.service.js';
import { createTokens, revokeTokens, verifyRefreshToken } from '../utils/jwt.utils.js';
import * as bcrypt from 'bcrypt';

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    let user;
    try {
        user = await usersService.getUserByEmail(email, {
            attributes: ['id', 'email', 'passwordHash']
        });
    } catch (err) {
        return next(err);
    }

    if (user && bcrypt.compare(password, user.passwordHash)) {
        let tokens;
        try {
            tokens = await createTokens({ email, id: user.id });
        } catch (err) {
            return next(err);
        }
        res.status(200).json(tokens);
    } else {
        res.sendStatus(401);
    }
}

export const logout = async (req, res, next) => {
    try {
        await revokeTokens(req.token);
    } catch (err) {
        return next(err);
    }
    res.sendStatus(204);
}

export const token = async (req, res, next) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        res.sendStatus(400);
    }

    verifyRefreshToken(refreshToken, async (err, payload) => {
        if (err || !payload) {
            return res.sendStatus(403);
        }

        let user;
        try {
            await revokeTokens(refreshToken);
            user = await usersService.getUserByEmail(payload.email);
        } catch (err) {
            return next(err);
        }

        if (user) {
            let tokens;
            try {
                tokens = await createTokens({ email: user.email, id: user.id });
            } catch (err) {
                return next(err);
            }
            res.status(200).json(tokens);
        } else {
            res.sendStatus(401);
        }
    });
}
