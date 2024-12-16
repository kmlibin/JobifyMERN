import Job from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

//auth middleware is applied to all these routes in server
export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;
  const { userId } = req.user;
  console.log("sort", sort);
  const queryObject = {
    createdBy: userId,
  };

  //will allow for some typos/similarities
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  //if status doesn't = all, attach it to the query object. same w/jobtype
  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  //setting up sort options for mongodob
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;
  //pagination
  //incoming page from our request, default is page 1
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  console.log(queryObject);
  //not doing try/catch because we have express-async-errors that sends errors to our synchronous error handling in server.js
  //onnly provide jobs that belong to a specific user
  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  const totalJobs = await Job.countDocuments(queryObject);
  //need to return pages for pagination on frontend. math.ceiling bc always want to round up
  const numOfPages = Math.ceil(totalJobs / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};

//create
export const createJob = async (req, res) => {
  //adding the createdBy to the req.body so logged in user is associated with that job
  req.body.createdBy = req.user.userId;
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

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    //first stage is match stage, match jobs which belongs to a certain user. need to convert user id into string, hence mongoose.types
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    //now group them and count them
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);

  //first param is what we return, current is the current iteration. we are taking the stats array and turning it into an object.
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  //set 0 as a check - if user just registered or have no jobs, return 0 to the frontend. frontend will also have checks.
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    //match jobs to a specific user
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        //create object with two props, year and month. it pulls out the year and month, convenient mongodb thing
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    //get the latest month first
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    //destructure the item
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      //format the date
      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      //date and count are what's sent to the frontend
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
