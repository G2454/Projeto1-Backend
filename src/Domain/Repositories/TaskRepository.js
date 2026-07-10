/**
 * Contrato (interface) do repositório de tarefas.
 * Ver EventRepository para a explicação do padrão de classe abstrata.
 */
export class TaskRepository {
    async save(task) {
        throw new Error("TaskRepository.save() não implementado.");
    }

    async findById(id) {
        throw new Error("TaskRepository.findById() não implementado.");
    }

    async findAll() {
        throw new Error("TaskRepository.findAll() não implementado.");
    }

    async update(id, task) {
        throw new Error("TaskRepository.update() não implementado.");
    }

    async delete(id) {
        throw new Error("TaskRepository.delete() não implementado.");
    }
}
