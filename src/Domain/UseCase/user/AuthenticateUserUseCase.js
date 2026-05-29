export class AuthenticateUserUseCase{
    constructor(userRepository){
        this.userRepository = userRepository;
    }
    async execute(username, password){
        const user = await this.userRepository.findByUsername(username);
        if(!user){
            throw new Error ("Usuário não encontrado");
        }
        const isPasswordValid = await user.authenticate(password);
        if(!isPasswordValid){
            throw new Error("Senha incorreta");
        }
        return user;
    }
}