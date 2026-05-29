import { Meeting } from '../../../Domain/Models/Meeting.js';

export class CreateMeetingUseCase {
    constructor(meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(meetingDto) {
        const meeting = Meeting.create(meetingDto);
        return await this.meetingRepository.save(meeting);
    }
}