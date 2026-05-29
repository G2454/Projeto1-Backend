import express from 'express';
import { requireLogin } from '../../shared/middlewares/requireLogin.js';
import { CreateTaskUseCase } from '../../Domain/UseCase/task/CreateTaskUseCase.js';
import { GetTaskUseCase } from '../../Domain/UseCase/task/GetTaskUseCase.js';
import { UpdateTaskUseCase } from '../../Domain/UseCase/task/UpdateTaskUseCase.js';
import { DeleteTaskUseCase } from '../../Domain/UseCase/task/DeleteTaskUseCase.js';
import { MongoTaskRepository } from '../../Infrastructure/Repository/MongoTaskRepository.js';

export function getTaskRoutes(dbCollection) {
    const router = express.Router();
    const repository = new MongoTaskRepository(dbCollection);
    const createUseCase = new CreateTaskUseCase(repository);
    const getUseCase = new GetTaskUseCase(repository);
    const updateUseCase = new UpdateTaskUseCase(repository);
    const deleteUseCase = new DeleteTaskUseCase(repository);

    // POST - Criar tarefa
    router.post('/', requireLogin, async (req, res) => {
        try {
            const task = await createUseCase.execute(req.body);
            return res.status(201).json({ 
                message: "Tarefa criada com sucesso", 
                data: task 
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // GET - Listar todas as tarefas
    router.get('/', requireLogin, async (req, res) => {
        try {
            const tasks = await getUseCase.executeAll();
            return res.json({ data: tasks });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Buscar tarefa por ID
    router.get('/:id', requireLogin, async (req, res) => {
        try {
            const task = await getUseCase.executeById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: "Tarefa não encontrada" });
            }
            return res.json({ data: task });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Atualizar tarefa
    router.put('/:id', requireLogin, async (req, res) => {
        try {
            const task = await updateUseCase.execute(req.params.id, req.body);
            return res.json({ 
                message: "Tarefa atualizada com sucesso", 
                data: task 
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Deletar tarefa
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
