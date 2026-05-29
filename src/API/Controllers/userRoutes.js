import express from 'express';
import { AuthenticateUserUseCase } from '../../Domain/UseCase/user/AuthenticateUserUseCase.js';
import { CreateUserUseCase } from '../../Domain/UseCase/user/CreateUserUseCase.js';
import { MongoUserRepository } from '../../Infrastructure/Repository/MongoUserRepository.js';

export function getUserRoutes(dbCollection) {
    const router = express.Router();
    const repository = new MongoUserRepository(dbCollection);
    const authenticateUseCase = new AuthenticateUserUseCase(repository);
    const createUserUseCase = new CreateUserUseCase(repository);

    router.post('/register', async (req, res) => {
        try {
            const { username, password, email } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: "Username e password são obrigatórios" });
            }
            if (password.length < 6) {
                return res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
            }
            const user = await createUserUseCase.execute({ username, password, email });
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.status(201).json({ 
                message: "Usuário criado com sucesso", 
                user: user.toJSON() 
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: "Username e password são obrigatórios" });
            }
            const user = await authenticateUseCase.execute(username, password);
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.json({ 
                message: "Login realizado com sucesso", 
                user: user.toJSON() 
            });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    });

    router.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ error: "Erro ao fazer logout" });
            return res.json({ message: "Logout realizado com sucesso" });
        });
    });

    return router;
}