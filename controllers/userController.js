import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";

//remember when we logged in, we made token, we use auth middleware to verify it, if verified, create req.user prop,
//on which there is user: {userId, role}. token stored as a cookie, which has this information.
export const getCurrentUser = async (req, res) => {
  const { userId } = req.user;
  const currentUser = await User.findOne({ _id: userId });
  //using the toJSON method created on the user schema
  const userWithoutPassword = currentUser.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

//for admin only - how many users we have, how many jobs
export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req, res) => {
  const { userId } = req.user;
  const userObject = { ...req.body };
  //just in case password is there, we don't want it. fyi, not there before this line was added
  delete userObject.password;
  const updatedUser = await User.findByIdAndUpdate(userId, userObject);
  res.status(StatusCodes.OK).json({ updatedUser });
};
