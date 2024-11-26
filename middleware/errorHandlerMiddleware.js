import { StatusCodes } from "http-status-codes";

//check for status code, if it's present we want to use that one. if not, we send a generic code
const errorHandlerMiddleware = (err, req, res, next) => {
    //when we set up the customError, we set up a property called statusCode. this is what we are accessing
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    //whatever we pass into the error when we invoke it, will be available in message
    const msg = err.message || 'something very generic went wrong'
    res.status(statusCode).json({message: msg})

  }

  export default errorHandlerMiddleware