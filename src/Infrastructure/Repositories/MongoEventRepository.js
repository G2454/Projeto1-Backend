import { ObjectId } from "mongodb";
import { EventRepository } from '../../Domain/Repositories/EventRepository.js';
import { Event } from '../../Domain/Entities/Event.js';

export class MongoEventRepository extends EventRepository {
    constructor(dbCollection) {
        super();
        this.collection = dbCollection;
    }

    async save(eventEntity) {
        const eventData = {
            name: eventEntity.name,
            date: eventEntity.date,
            location: eventEntity.location,
            description: eventEntity.description,
            createdAt: eventEntity.createdAt
        };
        const result = await this.collection.insertOne(eventData);
        eventEntity.id = result.insertedId;
        return eventEntity;
    }

    async findById(id) {
        const data = await this.collection.findOne({ _id: new ObjectId(id) });
        return data ? this._toDomain(data) : null;
    }

    async findAll() {
        const data = await this.collection.find({}).toArray();
        return data.map(d => this._toDomain(d));
    }

    async update(id, eventEntity) {
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: eventEntity.name,
                    date: eventEntity.date,
                    location: eventEntity.location,
                    description: eventEntity.description
                }
            }
        );
        return eventEntity;
    }

    async delete(id) {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    _toDomain(data) {
        return Event.restore({
            id: data._id,
            name: data.name,
            date: data.date,
            location: data.location,
            description: data.description,
            createdAt: data.createdAt
        });
    }
}
