import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

//these don't seem to work, they don't throw correct errors although error is thrown and it's a 400 ALL the time
//want to validate tests, and create a function that handles error
const withValidationErrors = (validateValues) => {
  //multiple middlewares, you return them in brackets
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        //use our status codes, pass errorMessages as the messages
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("jobLocation").notEmpty().withMessage("job location is required"),
  //for enums, use isIn
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("Invalid status values"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("Job typeis required"),
]);

//this will be different for every controller, there will be different things that we will validate in each controller
// export const validateTest = withValidationErrors([
//   body("name").notEmpty().isLength({min: 3, max: 50}).withMessage("name is required and between 3 and 50 characters").trim(),
// ]);

//below is split up, and turned into middleware

// //body gets the prop that needs validation from th eincoming data. notEmpty makes sure it isn't empty, withMessage is what it will send back
// //if it is empty. seconds, we send a function that will run errors. errors has a msg property with "name is required"
// app.post("/api/v1/test", [body('name').notEmpty().withMessage('name is required')], (req, res, next) => {
//     const errors = validationResult(req)

//     // if it's empty, it means we don't have errors
//     if(!errors.isEmpty()) {
//      //will map over and display all the errors
//      const errorMessages = errors.array().map((error) => error.msg)
//      //send back the error messages
//      return res.status(400).json({errors: errorMessages})
//     }
//     //no issues? pass to next middleware
//     next()
//    },
//    (req, res) => {
//      const {name} = req.body;
//      res.json({message: `hey ${name}`})
//    })
