import { CreateTaskDTO } from '../../Application/DTOs/task/CreateTaskDTO.js';
import { UpdateTaskDTO } from '../../Application/DTOs/task/UpdateTaskDTO.js';

export class TaskController {
    constructor({ createTaskService, getTaskService, updateTaskService, deleteTaskService }) {
        this.createTaskService = createTaskService;
        this.getTaskService = getTaskService;
        this.updateTaskService = updateTaskService;
        this.deleteTaskService = deleteTaskService;
    }

    create = async (req, res) => {
        try {
            const dto = CreateTaskDTO.fromRequest(req.body);
            const task = await this.createTaskService.execute(dto);
            return res.status(201).json({ message: "Tarefa criada com sucesso", data: task });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    getAll = async (req, res) => {
        try {
            const tasks = await this.getTaskService.executeAll();
            return res.json({ data: tasks });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    getById = async (req, res) => {
        try {
            const task = await this.getTaskService.executeById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: "Tarefa não encontrada" });
            }
            return res.json({ data: task });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const dto = UpdateTaskDTO.fromRequest(req.body);
            const task = await this.updateTaskService.execute(req.params.id, dto);
            return res.json({ message: "Tarefa atualizada com sucesso", data: task });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    delete = async (req, res) => {
        try {
            const result = await this.deleteTaskService.execute(req.params.id);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };
}
