import jwt from "jsonwebtoken";

export const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "8h", // Define a duração do token
  });
};