/**
 * Contrato (interface) do repositório de reuniões.
 * Ver EventRepository para a explicação do padrão de classe abstrata.
 */
export class MeetingRepository {
    async save(meeting) {
        throw new Error("MeetingRepository.save() não implementado.");
    }

    async findById(id) {
        throw new Error("MeetingRepository.findById() não implementado.");
    }

    async findAll() {
        throw new Error("MeetingRepository.findAll() não implementado.");
    }

    async update(id, meeting) {
        throw new Error("MeetingRepository.update() não implementado.");
    }

    async delete(id) {
        throw new Error("MeetingRepository.delete() não implementado.");
    }
}
