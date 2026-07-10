export class GetEventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async executeById(id) {
        return await this.eventRepository.findById(id);
    }

    async executeAll() {
        return await this.eventRepository.findAll();
    }
}
