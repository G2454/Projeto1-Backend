import { ObjectId } from 'mongodb';
import { MeetingRepository } from '../../Domain/Repositories/MeetingRepository.js';
import { Meeting } from '../../Domain/Entities/Meeting.js';

export class MongoMeetingRepository extends MeetingRepository {
    constructor(dbCollection) {
        super();
        this.collection = dbCollection;
    }

    async save(meetingEntity) {
        const meetingData = {
            name: meetingEntity.name,
            date: meetingEntity.date,
            location: meetingEntity.location,
            description: meetingEntity.description,
            createdAt: meetingEntity.createdAt
        };
        const result = await this.collection.insertOne(meetingData);
        meetingEntity.id = result.insertedId;
        return meetingEntity;
    }

    async findById(id) {
        const data = await this.collection.findOne({ _id: new ObjectId(id) });
        return data ? this._toDomain(data) : null;
    }

    async findAll() {
        const data = await this.collection.find({}).toArray();
        return data.map(d => this._toDomain(d));
    }

    async update(id, meetingEntity) {
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: {
                name: meetingEntity.name,
                date: meetingEntity.date,
                location: meetingEntity.location,
                description: meetingEntity.description
            }}
        );
        return meetingEntity;
    }

    async delete(id) {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    _toDomain(data) {
        return Meeting.restore({
            id: data._id,
            name: data.name,
            date: data.date,
            location: data.location,
            description: data.description,
            createdAt: data.createdAt
        });
    }
}
