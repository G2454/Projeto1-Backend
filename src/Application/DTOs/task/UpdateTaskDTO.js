/**
 * DTO de entrada para atualização de tarefa.
 */
export class UpdateTaskDTO {
    constructor({ name, dueDate, description }) {
        this.name = name;
        this.dueDate = dueDate;
        this.description = description;
    }

    static fromRequest(body = {}) {
        return new UpdateTaskDTO({
            name: body.name,
            dueDate: body.dueDate,
            description: body.description
        });
    }
}
