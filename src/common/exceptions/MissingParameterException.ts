export class MissingParameterException extends Error{
    name:string;
    message:string
    cause:any

    constructor(message:string,cause?:any){
        super()
        this.name = "MissingParameterException"
        this.message = message
        this.cause = cause
    }
}