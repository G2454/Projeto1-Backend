export class DeleteEventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(id) {
        await this.eventRepository.delete(id);
        return { message: "Evento deletado com sucesso" };
    }
}
