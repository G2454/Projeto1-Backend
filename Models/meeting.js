//Model for meetings in the calendar
class meeting{
    constructor(name, date, platform, details) {
        this.name = name;
        this.date = date;
        this.platform = platform;
        this.details = details; //Campo opcional - Não necessita de validação
    }
        validate() {
        if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
            throw new Error('Meeting name is required and must be a non-empty string');
        }
        if (!this.date || typeof this.date !== 'string') {
            throw new Error('Meeting date is required and must be a valid date string');
        }
        if (!this.platform || typeof this.platform !== 'string' || this.platform.trim() === '') {
            throw new Error('Meeting platform is required and must be a non-empty string');
        }
        return true;
    }
}

export { meeting };