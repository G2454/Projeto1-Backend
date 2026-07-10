import express from 'express';
import { requireLogin } from '../Middlewares/requireLogin.js';

export function createTaskRouter(taskController) {
    const router = express.Router();

    router.post('/', requireLogin, taskController.create);
    router.get('/', requireLogin, taskController.getAll);
    router.get('/:id', requireLogin, taskController.getById);
    router.put('/:id', requireLogin, taskController.update);
    router.delete('/:id', requireLogin, taskController.delete);

    return router;
}