import { Event } from '../../../Domain/Models/Event.js';

export class UpdateEventUseCase {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(id, eventDto) {
        const event = Event.create(eventDto);
        return await this.eventRepository.update(id, event);
    }
}