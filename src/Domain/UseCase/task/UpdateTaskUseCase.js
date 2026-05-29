import { Task } from '../../../Domain/Models/Task.js';

export class UpdateTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id, taskDto) {
        const task = Task.create(taskDto);
        return await this.taskRepository.update(id, task);
    }
}