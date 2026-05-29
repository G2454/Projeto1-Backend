import express from 'express';
import { requireLogin } from '../../shared/middlewares/requireLogin.js';
import { CreateMeetingUseCase } from '../../Domain/UseCase/meeting/CreateMeetingUseCase.js';
import { GetMeetingUseCase } from '../../Domain/UseCase/meeting/GetMeetingUseCase.js';
import { UpdateMeetingUseCase } from '../../Domain/UseCase/meeting/UpdateMeetingUseCase.js';
import { DeleteMeetingUseCase } from '../../Domain/UseCase/meeting/DeleteMeetingUseCase.js';
import { MongoMeetingRepository } from '../../Infrastructure/Repository/MongoMeetingRepository.js';

export function getMeetingRoutes(dbCollection) {
    const router = express.Router();
    const repository = new MongoMeetingRepository(dbCollection);
    const createUseCase = new CreateMeetingUseCase(repository);
    const getUseCase = new GetMeetingUseCase(repository);
    const updateUseCase = new UpdateMeetingUseCase(repository);
    const deleteUseCase = new DeleteMeetingUseCase(repository);

    // POST - Criar reunião
    router.post('/', requireLogin, async (req, res) => {
        try {
            const meeting = await createUseCase.execute(req.body);
            return res.status(201).json({ 
                message: "Reunião criada com sucesso", 
                data: meeting 
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // GET - Listar todas as reuniões
    router.get('/', requireLogin, async (req, res) => {
        try {
            const meetings = await getUseCase.executeAll();
            return res.json({ data: meetings });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Buscar reunião por ID
    router.get('/:id', requireLogin, async (req, res) => {
        try {
            const meeting = await getUseCase.executeById(req.params.id);
            if (!meeting) {
                return res.status(404).json({ error: "Reunião não encontrada" });
            }
            return res.json({ data: meeting });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Atualizar reunião
    router.put('/:id', requireLogin, async (req, res) => {
        try {
            const meeting = await updateUseCase.execute(req.params.id, req.body);
            return res.json({ 
                message: "Reunião atualizada com sucesso", 
                data: meeting 
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Deletar reunião
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
