import { UnauthenticatedError } from "../errors/customErrors.js";
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
    //create a new object on the request called user
    req.user = { user: userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("user not authorized, authmiddleware 2");
  }
};
