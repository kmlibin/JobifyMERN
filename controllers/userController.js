import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";

export const registerUser = async (req, res) => {
  //create the user.
  //if it's first user
  const isFirstUser = (await User.countDocuments()) === 0;
  const role = isFirstUser ? "admin" : "user";

  const newHashedPassword = await hashPassword(req.body.password);
  req.body.password = newHashedPassword;

  //remember, just req.body in this case because we are creating a validation layer that will confirm each value
  const user = await User.create({ ...req.body, role });
  res.status(StatusCodes.CREATED).json({ message: "user created!" });
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new UnauthenticatedError("user not found");
  }
  //if there is a user, we have the object with the password on it. recall user.password is already hashed.
  const isPasswordCorrect = await comparePassword(req.body.password, user.password)
  if(!isPasswordCorrect) {
    throw new UnauthenticatedError("invalid credentials")
  }
  res.send('login')
};
