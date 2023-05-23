export class CompanyNotFoundException extends Error{
    name:string;
    message:string
    cause:any

    constructor(message:string,cause?:string){
        super()
        this.name = "NotFoundException"
        this.message = message
        this.cause = cause
    }
}