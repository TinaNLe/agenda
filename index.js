class event 
{
    constructor(title, time, date, description) 
    {
        this.title = title;
        this.time = time;
        this.date = date;
        this.description = description;
    }

    destroy() 
    {
        this.title = null;
        this.time = null;
        this.date = null;
        this.description = null;
    }
}