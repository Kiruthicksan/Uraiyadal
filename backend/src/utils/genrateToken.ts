import jwt from "jsonwebtoken";
import type { Types } from "mongoose";


const genreateToken = ( userId : string | Types.ObjectId) => {
  return jwt.sign({ userId}, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};


export default genreateToken