import jwt from 'jsonwebtoken';
import serverConfig from '../config/server.config.js';
import models from "../models/index.js";
import * as crypto from 'crypto';

const {JWT} = models;

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } =  serverConfig;

const saveJWT = async (token, type) => {
    const {jti, exp, id} = jwt.decode(token);
    if (jti) {
        await JWT.create({
            userId: id,
            jwtid: jti,
            type: type,
            expireAt: new Date(exp * 1000).toISOString()
        });
    }
};

const revokeJWT = async (token) => {
    const {jti} = jwt.decode(token);
    if (jti) {
        return JWT.destroy({ where: { jwtid: jti } });
    }
};

const isAvailableJWT = async (token) => {
    const {jti} = jwt.decode(token);
    if (jti) {
        return JWT.findOne({ where: { jwtid: jti }, attributes: ['jwtid'] });
    } else {
        return true;
    }
}

export const createAccessToken = async (payload, options = {}) => {
    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h', ...options });
    await saveJWT(token, 'access');
    return token;
}

export const createRefreshToken = async (payload, options = {}) => {
    const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '180d', ...options });
    await saveJWT(token, 'refresh');
    return token;
}

export const createTokens = async (payload) => {
    const jwtid = crypto.randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
        createAccessToken(payload, { jwtid }),
        createRefreshToken(payload, { jwtid })
    ]);
    return {
        accessToken,
        refreshToken
    }
}

export const revokeTokens = async (token) => {
    return revokeJWT(token)
}

export const verifyAccessToken = async (token, cb) => {
    const isAvailable = await isAvailableJWT(token);

    if (!isAvailable) {
        cb(new Error('Token does not exist'), null);
    } else {
        jwt.verify(token, ACCESS_TOKEN_SECRET, cb);
    }
}

export const verifyRefreshToken = async (token, cb) => {
    const isAvailable = await isAvailableJWT(token);

    if (!isAvailable) {
        cb(new Error('Token does not exist'), null);
    } else {
        jwt.verify(token, REFRESH_TOKEN_SECRET, cb);
    }
}
