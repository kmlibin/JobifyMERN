import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  //bcrypt hashing. bigger the value, more secure password, but takes longer
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
