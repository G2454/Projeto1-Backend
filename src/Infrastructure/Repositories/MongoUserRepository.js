import { ObjectId } from 'mongodb';
import { UserRepository } from '../../Domain/Repositories/UserRepository.js';
import { User } from '../../Domain/Entities/User.js';

export class MongoUserRepository extends UserRepository {
    constructor(dbCollection) {
        super();
        this.collection = dbCollection;
    }

    async save(userEntity) {
        const userData = {
            username: userEntity.username,
            password: userEntity.password,
            email: userEntity.email,
            createdAt: userEntity.createdAt
        };
        const result = await this.collection.insertOne(userData);
        userEntity.id = result.insertedId;
        return userEntity;
    }

    async findByUsername(username) {
        const data = await this.collection.findOne({ username });
        return data ? this._toDomain(data) : null;
    }

    async findById(id) {
        const data = await this.collection.findOne({ _id: new ObjectId(id) });
        return data ? this._toDomain(data) : null;
    }

    async findAll() {
        const data = await this.collection.find({}).toArray();
        return data.map(d => this._toDomain(d));
    }

    async update(id, userEntity) {
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: {
                username: userEntity.username,
                email: userEntity.email
            }}
        );
        return userEntity;
    }

    async delete(id) {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    _toDomain(data) {
        return User.restore({
            id: data._id,
            username: data.username,
            password: data.password,
            email: data.email,
            createdAt: data.createdAt
        });
    }
}
