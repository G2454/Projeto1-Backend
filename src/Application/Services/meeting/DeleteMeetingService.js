export class DeleteMeetingService {
    constructor(meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(id) {
        await this.meetingRepository.delete(id);
        return { message: "Reunião deletada com sucesso" };
    }
}
