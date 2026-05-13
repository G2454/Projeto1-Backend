//Model for tasks in the calendar
class task{
    constructor(name, date, details) {
        this.name = name;
        this.date = date;
        this.details = details;
    }
        validate() {
        if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
            throw new Error('Task name is required and must be a non-empty string');
        }
        if (!this.date || typeof this.date !== 'string') {
            throw new Error('Task date is required and must be a valid date string');
        }
        return true;
    }
}

export { task };