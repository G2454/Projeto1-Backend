import { Event } from '../../../Domain/Entities/Event.js';

export class UpdateEventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(id, updateEventDTO) {
        const event = Event.create(updateEventDTO);
        return await this.eventRepository.update(id, event);
    }
}
