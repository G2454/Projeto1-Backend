import { CreateUserDTO } from '../../Application/DTOs/user/CreateUserDTO.js';
import { LoginDTO } from '../../Application/DTOs/user/LoginDTO.js';

export class UserController {
    constructor({ createUserService, authenticateUserService }) {
        this.createUserService = createUserService;
        this.authenticateUserService = authenticateUserService;
    }

    register = async (req, res) => {
        try {
            const dto = CreateUserDTO.fromRequest(req.body);
            const user = await this.createUserService.execute(dto);
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.status(201).json({ message: "Usuário criado com sucesso", user: user.toJSON() });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    login = async (req, res) => {
        try {
            const dto = LoginDTO.fromRequest(req.body);
            const user = await this.authenticateUserService.execute(dto.username, dto.password);
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.json({ message: "Login realizado com sucesso", user: user.toJSON() });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    };

    logout = (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ error: "Erro ao fazer logout" });
            return res.json({ message: "Logout realizado com sucesso" });
        });
    };
}
