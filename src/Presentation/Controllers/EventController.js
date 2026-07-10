import { CreateEventDTO } from '../../Application/DTOs/event/CreateEventDTO.js';
import { UpdateEventDTO } from '../../Application/DTOs/event/UpdateEventDTO.js';

/**
 * Controller de eventos. Depende apenas de Application Services (injetados via
 * construtor pelo composition root) — não conhece a Infraestrutura.
 *
 * Os métodos são arrow functions (class fields) para preservar o `this` quando
 * passados diretamente como handlers do Express.
 */
export class EventController {
    constructor({ createEventService, getEventService, updateEventService, deleteEventService }) {
        this.createEventService = createEventService;
        this.getEventService = getEventService;
        this.updateEventService = updateEventService;
        this.deleteEventService = deleteEventService;
    }

    create = async (req, res) => {
        try {
            const dto = CreateEventDTO.fromRequest(req.body);
            const event = await this.createEventService.execute(dto);
            return res.status(201).json({ message: "Evento criado com sucesso", data: event });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    getAll = async (req, res) => {
        try {
            const events = await this.getEventService.executeAll();
            return res.json({ data: events });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    getById = async (req, res) => {
        try {
            const event = await this.getEventService.executeById(req.params.id);
            if (!event) {
                return res.status(404).json({ error: "Evento não encontrado" });
            }
            return res.json({ data: event });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const dto = UpdateEventDTO.fromRequest(req.body);
            const event = await this.updateEventService.execute(req.params.id, dto);
            return res.json({ message: "Evento atualizado com sucesso", data: event });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    delete = async (req, res) => {
        try {
            const result = await this.deleteEventService.execute(req.params.id);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };
}