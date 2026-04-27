// Model for events in the calendar
class event{
    constructor(name, date, location, details) {
        this.name = name;
        this.date = date;
        this.location = location;
        this.details = details;
    }
}

export { event };