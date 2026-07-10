/**
 * DTO de entrada para registro de usuário.
 * Concentra a validação de entrada (presença e tamanho da senha) que antes
 * estava inline no controller.
 */
export class CreateUserDTO {
    constructor({ username, password, email }) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    static fromRequest(body = {}) {
        const { username, password, email } = body;

        if (!username || !password) {
            throw new Error("Username e password são obrigatórios");
        }
        if (password.length < 6) {
            throw new Error("Senha deve ter no mínimo 6 caracteres");
        }

        return new CreateUserDTO({ username, password, email });
    }
}
