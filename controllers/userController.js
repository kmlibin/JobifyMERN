import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

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
  //because of our multer middleware, we now have access to a file prop on req. req.file.
  const { userId } = req.user;
  const newUserObject = { ...req.body };
  //just in case password is there, we don't want it. fyi, password was not there before this line was added
  delete newUserObject.password;

  //CLOUDINARY
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    //we now want to remove the file form the public folder
    await fs.unlink(req.file.path);
    //secureURL points to the image, use on frontend to display image
    //publicId, we don't want to keep the old image around, so public id gets any previous id that had been stored. there won't be one for new users
    //because they haven't stsored anything yet. 
    newUserObject.avatar = response.secure_url;
    newUserObject.avatarPublicId = response.public_id;
  }
  const updatedUser = await User.findByIdAndUpdate(userId, newUserObject);

//if there is a new file, and if there is an old one in cloudinary, we want to delete the old one (path)
  if(req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId)
  }
  res.status(StatusCodes.OK).json({ updatedUser });
};
