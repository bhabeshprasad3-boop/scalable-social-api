import { Request } from "express";
export interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface AuthMulterRequest extends AuthRequest {
  file?: Express.Multer.File;
}  
