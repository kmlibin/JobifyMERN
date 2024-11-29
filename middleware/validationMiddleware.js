import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

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
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("user not")) {
          throw new UnauthorizedError(
            "user not authorized to access this route"
          );
        }
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

//check that only one email is used!
export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email address")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists on site");
      }
    }),
  body("location").notEmpty().withMessage("must include a location"),
  body("lastName").notEmpty().withMessage("please include a last name"),
  body("password")
    .notEmpty()
    .withMessage("please provide a password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email address")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      //
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("email already exists on site");
      }
    }),
  body("location").notEmpty().withMessage("must include a location"),
  body("lastName").notEmpty().withMessage("please include a last name"),
]);

export const validateLoginInput = withValidationErrors([
  body("email").notEmpty().withMessage("please provide email"),
  body("password").notEmpty().withMessage("please enter password"),
]);

//this validates the id param, which is how users find jobs
//we need to make sure that job id is only found by the user id that created/owns that specific job. admin also allowed full access
export const validateIdParam = withValidationErrors([
  param("id")
    //if this returns true, then it's fine and we sent to controller.
    ///it's kind of confusing to see where all the errors come from. if you do one less value in the id, this runs. if it's the same length,
    //the 404 runs that we set up with id not found we set up in the controller
    //fixed it by taking those errors out of the controller and doing it here - now we also search and find job in this middleware. throw error
    //if that job isn't found

    //custom value is async. so, remember it returns a promise
    .custom(async (value, { req }) => {
      const isValidId = mongoose.Types.ObjectId.isValid(value);

      //if false, this message doesn't show - the "BadRequest" from above gets used with the generic errorMessage that I don't set
      if (!isValidId)
        throw new BadRequestError(`no job found with id ${id}, BadReqfrom: VM`);
      const job = await Job.findById(value);
      if (!job) {
        throw new NotFoundError(
          `no job found with that id ${value} NotFound from: VM`
        );
      }
      const isAdmin = req.user.role === "admin";
      const isOwner = req.user.userId === job.createdBy.toString(); //has to be converted to a string to work
      if (!isAdmin && !isOwner) {
        throw new UnauthorizedError(
          "user not authorized to access this resource, 1"
        );
      }
    }),
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
