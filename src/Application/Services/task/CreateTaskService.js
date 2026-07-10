import { Task } from '../../../Domain/Entities/Task.js';

export class CreateTaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(createTaskDTO) {
        const task = Task.create(createTaskDTO);
        return await this.taskRepository.save(task);
    }
}
