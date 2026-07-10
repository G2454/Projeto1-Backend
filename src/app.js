import express from 'express';
import session from 'express-session';
import { setupSwagger } from './shared/config/swagger.js';

/**
 * Monta o app Express a partir de um container já resolvido (routers prontos).
 * Toda a fiação de dependências acontece no composition root (composition/container.js);
 * aqui tratamos apenas de configuração HTTP e montagem das rotas.
 */
export function buildApp(container) {
    const app = express();

    // Middlewares globais
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
        secret: "aslkdjaldj2394u12038sfaoj",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    }));

    // Swagger Documentation
    setupSwagger(app);

    // Rotas
    app.use('/api/users', container.userRouter);
    app.use('/api/events', container.eventRouter);
    app.use('/api/meetings', container.meetingRouter);
    app.use('/api/tasks', container.taskRouter);

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: "API is running" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: "Erro interno do servidor" });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: "Rota não encontrada" });
    });

    return app;
}