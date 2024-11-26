import { StatusCodes } from "http-status-codes";


//this is the 404 one
export class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}
//400
export class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestError';
      this.statusCode = StatusCodes.BAD_REQUEST;
    }
  }

  //401
  export class UnauthenticatedError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnauthenticatedError';
      this.statusCode = StatusCodes.UNAUTHORIZED;
    }
  }

  //403
  export class UnauthorizedError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnauthorizedError';
      this.statusCode = StatusCodes.FORBIDDEN;
    }
  }