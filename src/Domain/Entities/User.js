import bcrypt from 'bcrypt';

export class User {
    constructor({ id, username, password, email, createdAt }) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email || '';
        this.createdAt = createdAt || new Date();
    }

    static async create({ username, password, email }) {
        if (!username || !password) {
            throw new Error("Username e password são obrigatórios.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return new User({ username, password: hashedPassword, email });
    }

    static restore(data) {
        return new User({
            id: data.id,
            username: data.username,
            password: data.password,
            email: data.email,
            createdAt: data.createdAt
        });
    }

    async authenticate(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createdAt: this.createdAt
        };
    }
}
