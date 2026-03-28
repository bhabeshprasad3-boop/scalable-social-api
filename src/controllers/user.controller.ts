import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler"
import {Response} from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiError } from "../utils/ApiError";
import User from "../model/user.model";
import mongoose from "mongoose";
import { registerUserSchema, updateProfileSchema } from "../validators/user.validator";
import cloudinary from "../config/cloudniary";

export interface AuthMulterRequest extends AuthRequest {
  file?: Express.Multer.File;
}  

export const getMyProfile = asyncHandler(async(req:AuthRequest,res:Response)=>{
   if(!req.user){
    throw new ApiError(401,"Unauthorized")
   }

   const user = await User.findById(req.user._id).select("-password -refrehToken");

   if(!user){
      throw new ApiError(404,"User not fouond");
   }

   return res.status(200).json(
      new ApiResponse(200,user,"User profile fetched successfully")
   )
   
})

export const getUserById = asyncHandler(async (req:AuthRequest,res:Response)=>{

   const userId = req.params.userId;

   if(!userId){
      throw new ApiError(400,"Please provide user id")
   }

  if(!mongoose.Types.ObjectId.isValid(userId as string)){
   throw new ApiError(400,"Please provide valid user id");
  }
  
  const user = await User.findById(userId).select("-password -refreshToken");


  if(!user){
   throw new ApiError(404,"User not found")
  }

  return res.status(200).json(
  new ApiResponse(200,user,"Profile fetched successfully")
  )

    
   
});

export const updateMyProfile = asyncHandler(
  async (req: AuthMulterRequest, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    const validateResult = updateProfileSchema.safeParse(req.body);

    if (!validateResult.success) {
      const errorMessage = validateResult.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new ApiError(400, errorMessage);
    }

    const { username, bio } = validateResult.data;

    let profileURI: string | undefined;
    const file = req.file;

    if (file) {
      if (!file.mimetype.startsWith("image/")) {
        throw new ApiError(400, "Only image files are allowed");
      }

      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "student_details",
      });

      profileURI = cloudinaryResponse.secure_url;
    }

    const updateData: {
      username?: string;
      bio?: string;
      profileURI?: string;
    } = {};

    if (username) {
      updateData.username = username;
    }

    if (bio) {
      updateData.bio = bio;
    }

    if (profileURI) {
      updateData.profileURI = profileURI;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "Please provide at least one field to update");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true },
    ).select("-password -refreshToken");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Profile updated successfully"),
      );
  },
);


