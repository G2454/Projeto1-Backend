export class Event {
    constructor({ id, name, date, location, description, createdAt }) {
        this.id = id;
        this.name = name;
        this.date = date instanceof Date ? date : new Date(date);
        this.location = location || '';
        this.description = description || '';
        this.createdAt = createdAt || new Date();
    }

    // Factory para criação de um novo evento (aplica as invariantes de negócio).
    static create({ name, date, location, description }) {
        if (!name || !date) {
            throw new Error("Campos 'name' e 'date' são obrigatórios.");
        }
        return new Event({ name, date, location, description });
    }

    // Reconstitui uma entidade já existente (vinda da persistência) sem revalidar
    // nem resetar o createdAt.
    static restore(data) {
        return new Event({
            id: data.id,
            name: data.name,
            date: data.date,
            location: data.location,
            description: data.description,
            createdAt: data.createdAt
        });
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            date: this.date,
            location: this.location,
            description: this.description,
            createdAt: this.createdAt
        };
    }
}
