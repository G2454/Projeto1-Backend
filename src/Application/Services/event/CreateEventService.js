import { Event } from '../../../Domain/Entities/Event.js';

export class CreateEventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(createEventDTO) {
        const event = Event.create(createEventDTO);
        return await this.eventRepository.save(event);
    }
}
