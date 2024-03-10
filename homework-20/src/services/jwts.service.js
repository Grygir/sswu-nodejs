import jwt from "jsonwebtoken";
import models from "../models/index.js";

const {JWT} = models;

export const TYPES = {
    ACCESS: 'access',
    REFRESH: 'refresh'
}

export const saveJWT = async (tokenPairs) => {
    const bulk = tokenPairs.map(([ type, token ]) => {
        const { jti: jwtid, exp, id: userId } = jwt.decode(token);
        const expireAt = new Date(exp * 1000).toISOString();
        return { userId, jwtid, type, expireAt };
    }).filter(data => data.jwtid);

    if (bulk.length) {
        await JWT.bulkCreate(bulk);
    }
};

export const revokeJWT = async (token) => {
    const { jti: jwtid } = jwt.decode(token);
    if (jwtid) {
        return JWT.destroy({
            where: { jwtid }
        });
    }
};

export const isAvailableJWT = async (type, token) => {
    const { jti: jwtid } = jwt.decode(token);
    if (jwtid) {
        return JWT.findOne({
            where: { jwtid, type },
            attributes: ['jwtid']
        });
    } else {
        return true;
    }
}
