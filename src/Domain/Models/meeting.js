export class Meeting {
    constructor({ id, name, date, location, description }) {
        if (!name || !date) {
            throw new Error("Campos 'name' e 'date' são obrigatórios para Meeting.");
        }
        
        this.id = id;
        this.name = name;
        this.date = new Date(date);
        this.location = location || '';
        this.description = description || '';
        this.createdAt = new Date();
    }

    static create({ name, date, location, description }) {
        return new Meeting({ name, date, location, description });
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