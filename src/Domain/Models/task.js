export class Task {
    constructor({ id, name, dueDate, description, completed }) {
        if (!name || !dueDate) {
            throw new Error("Campos 'name' e 'dueDate' são obrigatórios para Task.");
        }
        
        this.id = id;
        this.name = name;
        this.dueDate = new Date(dueDate);
        this.description = description || '';
        this.completed = completed || false;
        this.createdAt = new Date();
    }

    static create({ name, dueDate, description }) {
        return new Task({ name, dueDate, description, completed: false });
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