import { Event } from '../../../Domain/Models/Event.js';

export class CreateEventUseCase {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(eventDto) {
        const event = Event.create(eventDto);
        return await this.eventRepository.save(event);
    }
}