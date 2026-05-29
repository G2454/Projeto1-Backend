export class DeleteTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id) {
        await this.taskRepository.delete(id);
        return { message: "Tarefa deletada com sucesso" };
    }
}