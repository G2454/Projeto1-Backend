import { CreateMeetingDTO } from '../../Application/DTOs/meeting/CreateMeetingDTO.js';
import { UpdateMeetingDTO } from '../../Application/DTOs/meeting/UpdateMeetingDTO.js';

export class MeetingController {
    constructor({ createMeetingService, getMeetingService, updateMeetingService, deleteMeetingService }) {
        this.createMeetingService = createMeetingService;
        this.getMeetingService = getMeetingService;
        this.updateMeetingService = updateMeetingService;
        this.deleteMeetingService = deleteMeetingService;
    }

    create = async (req, res) => {
        try {
            const dto = CreateMeetingDTO.fromRequest(req.body);
            const meeting = await this.createMeetingService.execute(dto);
            return res.status(201).json({ message: "Reunião criada com sucesso", data: meeting });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    getAll = async (req, res) => {
        try {
            const meetings = await this.getMeetingService.executeAll();
            return res.json({ data: meetings });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    getById = async (req, res) => {
        try {
            const meeting = await this.getMeetingService.executeById(req.params.id);
            if (!meeting) {
                return res.status(404).json({ error: "Reunião não encontrada" });
            }
            return res.json({ data: meeting });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const dto = UpdateMeetingDTO.fromRequest(req.body);
            const meeting = await this.updateMeetingService.execute(req.params.id, dto);
            return res.json({ message: "Reunião atualizada com sucesso", data: meeting });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    delete = async (req, res) => {
        try {
            const result = await this.deleteMeetingService.execute(req.params.id);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };
}