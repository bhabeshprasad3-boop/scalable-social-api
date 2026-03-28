import multer from "multer";
import { ApiError } from "../utils/ApiError";


const storage = multer.memoryStorage();

export const upload = multer(
    {storage:storage,
    limits:{fileSize: 5 * 1024 * 1024},
    
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("image/")){
            cb(null,true);
        }else{
         cb(new ApiError(400,"Invalid file type. Only images are allowed"))
        }
    }
})