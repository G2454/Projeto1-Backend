/**
 * DTO de entrada para atualização de evento.
 */
export class UpdateEventDTO {
    constructor({ name, date, location, description }) {
        this.name = name;
        this.date = date;
        this.location = location;
        this.description = description;
    }

    static fromRequest(body = {}) {
        return new UpdateEventDTO({
            name: body.name,
            date: body.date,
            location: body.location,
            description: body.description
        });
    }
}
