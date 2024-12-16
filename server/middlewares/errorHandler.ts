import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, TimeoutError } from "../error/errorMessage";

export const errorHandler: ErrorRequestHandler=(error:Error,req: Request, res: Response, nex: NextFunction)=> {
    if(error instanceof BadRequestError) {
        return res.status(error.statusCode).json({ errors: error.serializeErrors() });
    }

    if(error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ errors: error.serializeErrors() });
    }

    if(error instanceof ConflictError) {
        return res.status(error.statusCode).json({ errors: error.serializeErrors() });
    }

    if(error instanceof InternalServerError) {
        return res.status(error.statusCode).json({ errors: error.serializeErrors() });
    }

    if(error instanceof TimeoutError) {
        return res.status(error.statusCode).json({ errors: error.serializeErrors() });
    }

    if(error instanceof Error) {
        return res.status(500).json({ errors: error.message });
    }

    // For unexpected errors
    res.status(500).send({ message: "Something went wrong" });
}