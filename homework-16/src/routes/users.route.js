import express from 'express';
import * as usersController from '../controller/users.controller.js';
import jwtAuth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(501);
    }
});
router.post('/', usersController.createUser);
router.all('/', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

router.get('/:id', jwtAuth, usersController.getUserById);
router.patch('/:id', jwtAuth, usersController.updateUser);
router.delete('/:id', jwtAuth, usersController.deleteUser);
router.all('/:id', (req, res) => {
    if (!res.headersSent) {
        res.sendStatus(405);
    }
});

export default router;
