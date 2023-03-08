class ValidationError extends Error {
    public responseStatus! :number
    constructor(message:string, status:number) {
        super(message);
        this.responseStatus = status;
    }
}

export {ValidationError}

