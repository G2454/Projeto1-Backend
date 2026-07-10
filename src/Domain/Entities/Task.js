export class Task {
    constructor({ id, name, dueDate, description, completed, createdAt }) {
        this.id = id;
        this.name = name;
        this.dueDate = dueDate instanceof Date ? dueDate : new Date(dueDate);
        this.description = description || '';
        this.completed = completed || false;
        this.createdAt = createdAt || new Date();
    }

    static create({ name, dueDate, description }) {
        if (!name || !dueDate) {
            throw new Error("Campos 'name' e 'dueDate' são obrigatórios para Task.");
        }
        return new Task({ name, dueDate, description, completed: false });
    }

    static restore(data) {
        return new Task({
            id: data.id,
            name: data.name,
            dueDate: data.dueDate,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt
        });
    }

    markComplete() {
        this.completed = true;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            dueDate: this.dueDate,
            description: this.description,
            completed: this.completed,
            createdAt: this.createdAt
        };
    }
}
