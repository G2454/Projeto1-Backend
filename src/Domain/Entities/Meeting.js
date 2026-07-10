export class Meeting {
    constructor({ id, name, date, location, description, createdAt }) {
        this.id = id;
        this.name = name;
        this.date = date instanceof Date ? date : new Date(date);
        this.location = location || '';
        this.description = description || '';
        this.createdAt = createdAt || new Date();
    }

    static create({ name, date, location, description }) {
        if (!name || !date) {
            throw new Error("Campos 'name' e 'date' são obrigatórios para Meeting.");
        }
        return new Meeting({ name, date, location, description });
    }

    static restore(data) {
        return new Meeting({
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
