/**
 * Contrato (interface) do repositório de eventos.
 *
 * O Domínio define o contrato; a Infraestrutura o implementa. Como o JavaScript
 * não possui `interface`, usamos uma classe abstrata cujos métodos lançam erro
 * caso não sejam sobrescritos. Isso permite a inversão de dependência: as
 * camadas Application/Presentation dependem desta abstração, nunca do MongoDB.
 */
export class EventRepository {
    async save(event) {
        throw new Error("EventRepository.save() não implementado.");
    }

    async findById(id) {
        throw new Error("EventRepository.findById() não implementado.");
    }

    async findAll() {
        throw new Error("EventRepository.findAll() não implementado.");
    }

    async update(id, event) {
        throw new Error("EventRepository.update() não implementado.");
    }

    async delete(id) {
        throw new Error("EventRepository.delete() não implementado.");
    }
}
