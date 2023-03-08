import { Response } from "express"
import {ValidationError} from "./errors"

const successResponse = (statusCode:number,payload:object,res:Response) =>{
    return res.status(statusCode).json(payload)
}

const errorResponse = (error:Error,res:Response) =>{
    if (error instanceof ValidationError) {
        return res.status(error.responseStatus).json({ error: error.message });
    }
    return res.status(500).json({error: "Internal Server Error"})
}

export {successResponse,errorResponse}