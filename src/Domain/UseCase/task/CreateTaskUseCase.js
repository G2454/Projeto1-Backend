import { Task } from '../../Models/Task.js';

export class CreateTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(taskDto) {
        const task = Task.create(taskDto);
        return await this.taskRepository.save(task);
    }
}