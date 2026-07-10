/**
 * Contrato (interface) do repositório de usuários.
 * Ver EventRepository para a explicação do padrão de classe abstrata.
 */
export class UserRepository {
    async save(user) {
        throw new Error("UserRepository.save() não implementado.");
    }

    async findById(id) {
        throw new Error("UserRepository.findById() não implementado.");
    }

    async findByUsername(username) {
        throw new Error("UserRepository.findByUsername() não implementado.");
    }

    async findAll() {
        throw new Error("UserRepository.findAll() não implementado.");
    }

    async update(id, user) {
        throw new Error("UserRepository.update() não implementado.");
    }

    async delete(id) {
        throw new Error("UserRepository.delete() não implementado.");
    }
}
