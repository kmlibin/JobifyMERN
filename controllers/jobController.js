import Job from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";

//auth middleware is applied to all these routes in server
export const getAllJobs = async (req, res) => {
  const { user } = req.user;
  //not doing try/catch because we have express-async-errors that sends errors to our synchronous error handling in server.js
  //onnly provide jobs that belong to a specific user
  const jobs = await Job.find({ createdBy: user });
  res.status(StatusCodes.OK).json({ jobs });
};

//create
export const createJob = async (req, res) => {
  //adding the createdBy to the req.body so logged in user is associated with that job
  req.body.createdBy = req.user.user
  try {
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "server error" });
  }
};
//get single job by id. validating id matches person who created the job in validations
export const getJob = async (req, res) => {
  const { id } = req.params;
  //still grab job, even though it's done in middleware. middleware is just checking that it exists, it's not sending it along
  const job = await Job.findById(id);

  res.status(StatusCodes.OK).json({ job });
};

//edit job validating id matches person who created the job in validations
export const editJob = async (req, res) => {
  const { id } = req.params;
  //will check for empty values, so will just pass req.body. otherwise pass object with what needs changing
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
  //so, since no try/catch, if something goes wrong with the process of deleting, i assume that gets thrown and generically caught
  //now handled in middleware
  // if (!updatedJob) {
  //   throw new NotFoundError(`no job with that id`);
  // }

  res.status(StatusCodes.OK).json({ message: "job modified", job: updatedJob });
};

//delete job
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await Job.findByIdAndDelete(id);
  //so, since no try/catch, if something goes wrong with the process of deleting, i assume that gets thrown and generically caught
  //now in middleware where it checks if job exists. if if it doesn't, this won't run
  // if (!removedJob) {
  //   throw new NotFoundError(`no job with that id`);
  // }

  res.status(StatusCodes.OK).json({ message: "job has been deleted" });
};
