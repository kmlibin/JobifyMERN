import jwt from "jsonwebtoken";

//payload, in this case, will have userId and role
//JWT is sent to frontend, frontend sends it back with every request, we decode it on backend
export const createJWT = (payload) => {
  //payload is value you want to hold
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

//verify the jwt is valid
export const verifyJWT = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken;
};
