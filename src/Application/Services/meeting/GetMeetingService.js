export class GetMeetingService {
    constructor(meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async executeById(id) {
        return await this.meetingRepository.findById(id);
    }

    async executeAll() {
        return await this.meetingRepository.findAll();
    }
}
