import express from 'express';
import { requireLogin } from '../Middlewares/requireLogin.js';

export function createMeetingRouter(meetingController) {
    const router = express.Router();

    router.post('/', requireLogin, meetingController.create);
    router.get('/', requireLogin, meetingController.getAll);
    router.get('/:id', requireLogin, meetingController.getById);
    router.put('/:id', requireLogin, meetingController.update);
    router.delete('/:id', requireLogin, meetingController.delete);

    return router;
}