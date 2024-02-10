import * as usersService from '../services/users.service.js';
import * as bcrypt from 'bcrypt';
import serverConfig from '../config/server.config.js';
const { PASSWORD_HASH_ROUNDS } =  serverConfig;

export const createUser = async (req, res, next) => {
    const { password, ...data } = req.body;
    const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

    let user;
    try {
        user = await usersService.createUser({ passwordHash, ...data });
    } catch (err) {
        return next(err);
    }

    res.location(`${req.baseUrl}/${user.id}`);
    res.status(201).json(user);
};

export const getUserById = async (req, res, next) => {
    const { id: userId } = req.params;
    const { id: currentUserId } = req.user;
    let user;
    const options = {}
    if (userId !== currentUserId) {
        options.attributes = { exclude: ['email'] };
    }

    try {
        user = await usersService.getUserById(userId, options);
    } catch (err) {
        return next(err);
    }

    if (user) {
        res.status(200).json(user);
    } else {
        res.sendStatus(404);
    }
};

export const updateUser = async (req, res, next) => {
    const data = req.body;
    const { id: userId } = req.params;
    const { id: currentUserId } = req.user;
    if (userId !== currentUserId) {
        return res.sendStatus(403);
    }

    let updated;
    try {
        [updated] = await usersService.updateUser(userId, data);
    } catch (err) {
        return next(err);
    }

    if (updated) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
};

export const deleteUser = async  (req, res, next) => {
    const { id: userId } = req.params;
    const { id: currentUserId } = req.user;
    if (userId !== currentUserId) {
        return res.sendStatus(403);
    }

    let result;
    try {
        result = await usersService.deleteUser(req.params.id);
    } catch (err) {
        return next(err);
    }

    if (result) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
};
