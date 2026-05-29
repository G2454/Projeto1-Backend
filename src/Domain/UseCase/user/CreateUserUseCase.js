import { User } from '../../Models/User.js';

export class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userDto) {
        const existingUser = await this.userRepository.findByUsername(userDto.username);
        if (existingUser) {
            throw new Error("Usuário já existe");
        }
        const user = await User.create(userDto);

        return await this.userRepository.save(user);
    }
}
