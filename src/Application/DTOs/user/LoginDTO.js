/**
 * DTO de entrada para autenticação de usuário.
 */
export class LoginDTO {
    constructor({ username, password }) {
        this.username = username;
        this.password = password;
    }

    static fromRequest(body = {}) {
        const { username, password } = body;

        if (!username || !password) {
            throw new Error("Username e password são obrigatórios");
        }

        return new LoginDTO({ username, password });
    }
}
