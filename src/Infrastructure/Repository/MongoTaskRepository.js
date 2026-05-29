import { ObjectId } from 'mongodb';

export class MongoTaskRepository {
    constructor(dbCollection) {
        this.collection = dbCollection;
    }

    async save(taskEntity) {
        const taskData = {
            name: taskEntity.name,
            dueDate: taskEntity.dueDate,
            description: taskEntity.description,
            completed: taskEntity.completed,
            createdAt: taskEntity.createdAt
        };
        const result = await this.collection.insertOne(taskData);
        taskEntity.id = result.insertedId;
        return taskEntity;
    }

    async findById(id) {
        const data = await this.collection.findOne({ _id: new ObjectId(id) });
        return data ? this._toDomain(data) : null;
    }

    async findAll() {
        const data = await this.collection.find({}).toArray();
        return data.map(d => this._toDomain(d));
    }

    async update(id, taskEntity) {
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: {
                name: taskEntity.name,
                dueDate: taskEntity.dueDate,
                description: taskEntity.description,
                completed: taskEntity.completed
            }}
        );
        return taskEntity;
    }

    async delete(id) {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    _toDomain(data) {
        return {
            id: data._id,
            name: data.name,
            dueDate: data.dueDate,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt
        };
    }
}