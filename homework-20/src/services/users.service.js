import models from '../models/index.js';

const {User} = models;

export const getUserByEmail = async (email, options = {}) => {
    return User.findOne({
        ...options,
        where: { email }
    });
};

export const createUser = async (data) => {
     return User.create(data);
};

export const getUserById = async (userId, options = {}) => {
    return User.findByPk(userId, options);
};

export const updateUser = async (userId, data) => {
    return User.update(data, { where: { id: userId } });
};

export const deleteUser = async (userId) => {
    return User.destroy({ where: { id: userId } });
}
