import express from 'express';
import session from 'express-session';
import { setupSwagger } from './shared/config/swagger.js';
import { getEventRoutes } from './API/Controllers/eventRoutes.js';
import { getMeetingRoutes } from './API/Controllers/meetingRoutes.js';
import { getTaskRoutes } from './API/Controllers/taskRoutes.js';
import { getUserRoutes } from './API/Controllers/userRoutes.js';

export function buildApp(dbCollections) {
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
    app.use('/api/users', getUserRoutes(dbCollections.usersCollection));
    app.use('/api/events', getEventRoutes(dbCollections.eventsCollection));
    app.use('/api/meetings', getMeetingRoutes(dbCollections.meetingsCollection));
    app.use('/api/tasks', getTaskRoutes(dbCollections.tasksCollection));

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
