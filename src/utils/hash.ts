import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  plain: string,
  hashed: string
) => {
  return bcrypt.compare(plain, hashed);
};