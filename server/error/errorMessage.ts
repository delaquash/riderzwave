import { CustomError } from "../utils/CustomError";

export class NotFoundError extends CustomError {
    public statusCode: number = 404;

    constructor() {
        super("Resource not found");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): { message: string } {
        return { message: "Resource not found" };
    }
}

export class ConflictError extends CustomError {
    public statusCode: number = 409;

    constructor() {
        super("Conflict error");
        Object.setPrototypeOf(this, ConflictError.prototype);
    }

    serializeErrors(): { message: string } {
        return { message: "Conflict error" };
    }
}

export class InternalServerError extends CustomError {
    public statusCode: number = 500;

    constructor() {
        super("Internal server error");
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    serializeErrors(): { message: string } {
        return { message: "Internal server error" };
    }
}

export class BadRequestError extends CustomError {
    public statusCode: number = 400;

    constructor() {
        super("Bad request");
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors(): { message: string } {
        return { message: "Bad request" };
    }
}

export class TimeoutError extends CustomError {
    public statusCode: number = 408;

    constructor() {
        super("Request timed out");
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }

    serializeErrors(): { message: string } {
        return { message: "Request timed out" };
    }
}
