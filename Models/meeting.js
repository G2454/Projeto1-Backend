//Model for meetings in the calendar
class meeting{
    constructor(name, date, platform, details) {
        this.name = name;
        this.date = date;
        this.platform = platform;
        this.details = details;
    }
}

export { meeting };