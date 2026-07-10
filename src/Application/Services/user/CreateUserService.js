import { User } from '../../../Domain/Entities/User.js';

export class CreateUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(createUserDTO) {
        const existingUser = await this.userRepository.findByUsername(createUserDTO.username);
        if (existingUser) {
            throw new Error("Usuário já existe");
        }
        const user = await User.create(createUserDTO);
        return await this.userRepository.save(user);
    }
}
