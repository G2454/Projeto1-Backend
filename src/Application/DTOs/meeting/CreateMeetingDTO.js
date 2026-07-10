/**
 * DTO de entrada para criação de reunião.
 */
export class CreateMeetingDTO {
    constructor({ name, date, location, description }) {
        this.name = name;
        this.date = date;
        this.location = location;
        this.description = description;
    }

    static fromRequest(body = {}) {
        return new CreateMeetingDTO({
            name: body.name,
            date: body.date,
            location: body.location,
            description: body.description
        });
    }
}
