import { Task } from '../../../Domain/Entities/Task.js';

export class UpdateTaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id, updateTaskDTO) {
        const task = Task.create(updateTaskDTO);
        return await this.taskRepository.update(id, task);
    }
}
