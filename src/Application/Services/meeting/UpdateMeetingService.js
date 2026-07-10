import { Meeting } from '../../../Domain/Entities/Meeting.js';

export class UpdateMeetingService {
    constructor(meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(id, updateMeetingDTO) {
        const meeting = Meeting.create(updateMeetingDTO);
        return await this.meetingRepository.update(id, meeting);
    }
}
