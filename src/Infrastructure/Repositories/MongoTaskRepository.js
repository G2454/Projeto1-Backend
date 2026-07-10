import { ObjectId } from 'mongodb';
import { TaskRepository } from '../../Domain/Repositories/TaskRepository.js';
import { Task } from '../../Domain/Entities/Task.js';

export class MongoTaskRepository extends TaskRepository {
    constructor(dbCollection) {
        super();
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
        return Task.restore({
            id: data._id,
            name: data.name,
            dueDate: data.dueDate,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt
        });
    }
}
