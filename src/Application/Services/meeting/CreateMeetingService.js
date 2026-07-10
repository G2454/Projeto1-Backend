import { Meeting } from '../../../Domain/Entities/Meeting.js';

export class CreateMeetingService {
    constructor(meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(createMeetingDTO) {
        const meeting = Meeting.create(createMeetingDTO);
        return await this.meetingRepository.save(meeting);
    }
}
