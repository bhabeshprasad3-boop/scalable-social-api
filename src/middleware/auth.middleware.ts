import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

interface AuthenticatedUser {
  _id: string;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

interface AccessTokenPayload extends JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const verifyJWT = asyncHandler( async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.accessToken ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      token,
      accessTokenSecret,
    ) as AccessTokenPayload;

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    };

     next();
   
   
});