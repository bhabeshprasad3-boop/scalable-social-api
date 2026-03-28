import User from "../model/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response, NextFunction } from "express";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/user.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { getCookieOptions } from "../utils/cookieOptions";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

interface RefreshTokenPayload extends JwtPayload {
  _id: string;
}

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatorResult = registerUserSchema.safeParse(req.body);

    if (!validatorResult.success) {
      const errorMessage = validatorResult.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessage.join(", "));
    }

    const { username, email, password } = validatorResult.data;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists",
      );
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const responseUser = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
    return res
      .status(201)
      .json(new ApiResponse(201, responseUser, "User registered successfully"));
  },
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validateResult = loginUserSchema.safeParse(req.body);

    if (!validateResult.success) {
      const messageError = validateResult.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new ApiError(400, messageError);
    }

    const { email, password } = validateResult.data;

    const user = await User.findOne({ email }).select(
      "+password +refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const responseUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    const accessTokenOptions = getCookieOptions(15 * 60 * 1000);
    const refreshTokenOptions = getCookieOptions(7 * 24 * 60 * 60 * 1000);

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json(new ApiResponse(200, responseUser, "User logged in successfully"));
  },
);

export const logoutUser = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        refreshToken: 1,
      },
    });

    const optionForClear = getCookieOptions(0);

    return res
      .status(200)
      .clearCookie("accessToken", optionForClear)
      .clearCookie("refreshToken", optionForClear)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  },
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!refreshTokenSecret) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      refreshTokenSecret,
    ) as RefreshTokenPayload;

    const user = await User.findById(decodedToken._id).select("+refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (!user.refreshToken || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const newAccessTokenOptions = getCookieOptions(15 * 60 * 1000);
    const newRefreshTokenOptions = getCookieOptions(7 * 24 * 60 * 60 * 1000);

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, newAccessTokenOptions)
      .cookie("refreshToken", newRefreshToken, newRefreshTokenOptions)
      .json(new ApiResponse(200, null, "Access token refreshed successfully"));
  },
);
