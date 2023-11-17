import jwt, { Secret } from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: "1d",
    }
  );
};
