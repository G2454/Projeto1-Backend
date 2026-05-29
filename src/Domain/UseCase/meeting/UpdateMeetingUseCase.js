import { Meeting } from '../../../Domain/Models/Meeting.js';

export class UpdateMeetingUseCase {
    constructor(meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(id, meetingDto) {
        const meeting = Meeting.create(meetingDto);
        return await this.meetingRepository.update(id, meeting);
    }
}