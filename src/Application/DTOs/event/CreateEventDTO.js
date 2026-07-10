/**
 * DTO de entrada para criação de evento.
 * Faz o whitelist dos campos aceitos (evita mass-assignment de req.body).
 */
export class CreateEventDTO {
    constructor({ name, date, location, description }) {
        this.name = name;
        this.date = date;
        this.location = location;
        this.description = description;
    }

    static fromRequest(body = {}) {
        return new CreateEventDTO({
            name: body.name,
            date: body.date,
            location: body.location,
            description: body.description
        });
    }
}
