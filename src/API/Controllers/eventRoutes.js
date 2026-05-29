import express from 'express';
import { requireLogin } from '../../shared/middlewares/requireLogin.js';
import { CreateEventUseCase } from '../../Domain/UseCase/event/CreateEventUseCase.js';
import { GetEventUseCase } from '../../Domain/UseCase/event/GetEventUseCase.js';
import { UpdateEventUseCase } from '../../Domain/UseCase/event/UpdateEventUseCase.js';
import { DeleteEventUseCase } from '../../Domain/UseCase/event/DeleteEventUseCase.js';
import { MongoEventRepository } from '../../Infrastructure/Repository/MongoEventRepository.js';

export function getEventRoutes(dbCollection) {
    const router = express.Router();
    const repository = new MongoEventRepository(dbCollection);
    const createUseCase = new CreateEventUseCase(repository);
    const getUseCase = new GetEventUseCase(repository);
    const updateUseCase = new UpdateEventUseCase(repository);
    const deleteUseCase = new DeleteEventUseCase(repository);

    // POST - Criar evento
    router.post('/', requireLogin, async (req, res) => {
        try {
            const event = await createUseCase.execute(req.body);
            return res.status(201).json({ 
                message: "Evento criado com sucesso", 
                data: event 
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // GET - Listar todos os eventos
    router.get('/', requireLogin, async (req, res) => {
        try {
            const events = await getUseCase.executeAll();
            return res.json({ data: events });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Buscar evento por ID
    router.get('/:id', requireLogin, async (req, res) => {
        try {
            const event = await getUseCase.executeById(req.params.id);
            if (!event) {
                return res.status(404).json({ error: "Evento não encontrado" });
            }
            return res.json({ data: event });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Atualizar evento
    router.put('/:id', requireLogin, async (req, res) => {
        try {
            const event = await updateUseCase.execute(req.params.id, req.body);
            return res.json({ 
                message: "Evento atualizado com sucesso", 
                data: event 
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Deletar evento
    router.delete('/:id', requireLogin, async (req, res) => {
        try {
            const result = await deleteUseCase.execute(req.params.id);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    return router;
}
