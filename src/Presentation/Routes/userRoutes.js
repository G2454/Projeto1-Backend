import express from 'express';

export function createUserRouter(userController) {
    const router = express.Router();

    router.post('/register', userController.register);
    router.post('/login', userController.login);
    router.post('/logout', userController.logout);

    return router;
}