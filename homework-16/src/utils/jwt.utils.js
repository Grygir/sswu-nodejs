import jwt from 'jsonwebtoken';
import serverConfig from '../config/server.config.js';
import * as crypto from 'crypto';
import * as jwtsService from '../services/jwts.service.js';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } =  serverConfig;

export const createAccessToken = async (payload, options = {}) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h', ...options });
}

export const createRefreshToken = async (payload, options = {}) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '180d', ...options });
}

export const createTokens = async (payload) => {
    const jwtid = crypto.randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
        createAccessToken(payload, { jwtid }),
        createRefreshToken(payload, { jwtid })
    ]);
    await jwtsService.saveJWT([
        [jwtsService.TYPES.ACCESS, accessToken],
        [jwtsService.TYPES.REFRESH, refreshToken]
    ]);
    return {
        accessToken,
        refreshToken
    }
}

export const revokeTokens = async (token) => {
    return jwtsService.revokeJWT(token)
}

export const verifyAccessToken = async (token, cb) => {
    const isAvailable = await jwtsService.isAvailableJWT(jwtsService.TYPES.ACCESS, token);
    if (isAvailable) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, cb);
    } else {
        cb(new Error('Token does not exist'), null);
    }
}

export const verifyRefreshToken = async (token, cb) => {
    const isAvailable = await jwtsService.isAvailableJWT(jwtsService.TYPES.REFRESH, token);
    if (isAvailable) {
        jwt.verify(token, REFRESH_TOKEN_SECRET, cb);
    } else {
        cb(new Error('Token does not exist'), null);
    }
}
