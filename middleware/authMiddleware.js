import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";
//use as way to protect routes
//our cookie is called "token". basically, we check if the request has a token, if it does, we add a new object called user to the req object.
//we can use the req.user to protect routes.
export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("user not authorized, authmiddleware");
  }
  try {
    const { userId, role } = verifyJWT(token);
    //check if it's the testuser id
    const testUser = userId === "675cbcd1f5af21b656f14b11";
    //create a new object on the request called user
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("user not authorized, authmiddleware 2");
  }
};

//check that the user is admin. we pased in admin when we invoked it in routes.
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    //the role, admin, has to match what's on req.user.role
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(
        "unauthorized to access this route! unauthorize permissions"
      );
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo user, read only!");
  }
  next();
};
