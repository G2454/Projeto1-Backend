/**
 * DTO de entrada para criação de tarefa.
 */
export class CreateTaskDTO {
    constructor({ name, dueDate, description }) {
        this.name = name;
        this.dueDate = dueDate;
        this.description = description;
    }

    static fromRequest(body = {}) {
        return new CreateTaskDTO({
            name: body.name,
            dueDate: body.dueDate,
            description: body.description
        });
    }
}
