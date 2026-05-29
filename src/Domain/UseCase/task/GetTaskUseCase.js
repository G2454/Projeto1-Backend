export class GetTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async executeById(id) {
        return await this.taskRepository.findById(id);
    }

    async executeAll() {
        return await this.taskRepository.findAll();
    }
}