import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { createPostSchema } from "../validators/post.validator";
import cloudinary from "../config/cloudniary";
import { ApiResponse } from "../utils/ApiResponse";
import Post from "../model/post.model";
import { AuthMulterRequest, AuthRequest } from "../types/express.types";
import mongoose from "mongoose";


export const createPost = asyncHandler(
  async (req: AuthMulterRequest, res: Response) => {
    let postURI = "";

    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    const validateResult = createPostSchema.safeParse(req.body);

    if (!validateResult.success) {
      const errorMessage = validateResult.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessage.join(", "));
    }

    const { caption } = validateResult.data;

    const file = req.file;

    if (file) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "post_details",
      });

      postURI = cloudinaryResponse.secure_url;
    }

    const post = await Post.create({
      author: req.user._id,
      caption,
      image: postURI,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  },
);

export const getAllPost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 5, 1);

    const skipValue = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const totalPage = Math.ceil(totalPosts / limit);

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skipValue)
      .limit(limit)
      .select("-__v -updatedAt")
      .populate("author", "username profileURI");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          posts,
          pagination: { totalPosts, totalPage, currerntPage: page, limit },
        },
        "Post fetched successfully",
      ),
    );
  },
);

export const getSinglePost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    const postId = req.params.postId;

    if (typeof postId !== "string") {
      throw new ApiError(400, "Invalid Post ID format");
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "Please provide valid post id");
    }

    const singlePost = await Post.findById(postId)
      .select("-__v -updatedAt")
      .populate("author", "username profileURI");

    if (!singlePost) {
      throw new ApiError(404, "Post not found!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, singlePost, "Post fetched successfully"));
  },
);

export const deleteMyPost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    
  
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    const postId  = req.params.postId;

    if (typeof postId !== "string") {
      throw new ApiError(400, "Invalid Post ID format");
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "Please provide valid post id");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

   
    if (post.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to delete this post");
    }

   const deletePost =  await Post.findByIdAndDelete(postId);


    return res.status(200).json(
      new ApiResponse(200, deleteMyPost, "Post deleted successfully") 
    );
  }
);
