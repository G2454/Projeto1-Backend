// Model for events in the calendar
class event{
    constructor(name, date, location, details) {
        this.name = name;
        this.date = date;
        this.location = location;
        this.details = details;
    }
    validate(){
        if(!this.name || typeof this.name !== 'string' || this.name.trim() === ''){
            throw new Error('Event name is required!');
        }
        if(!this.date || typeof this.date !== 'string'){
            throw new Error('Event date is required!');
        }
        if(!this.location || typeof this.location !== 'string' || this.location.trim() === ''){
            throw new Error('Event location is required');
        }
    }
}

export { event };