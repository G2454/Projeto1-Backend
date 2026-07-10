import express from 'express';
import { requireLogin } from '../Middlewares/requireLogin.js';

export function createEventRouter(eventController) {
    const router = express.Router();

    router.post('/', requireLogin, eventController.create);
    router.get('/', requireLogin, eventController.getAll);
    router.get('/:id', requireLogin, eventController.getById);
    router.put('/:id', requireLogin, eventController.update);
    router.delete('/:id', requireLogin, eventController.delete);

    return router;
}