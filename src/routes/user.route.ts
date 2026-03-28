import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  getMyProfile,
  getUserById,
  updateMyProfile,
} from "../controllers/user.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.get("/user/me", verifyJWT, getMyProfile);
router.get("/user/:userId", verifyJWT, getUserById);
router.patch("/user/me", verifyJWT, upload.single("profile"), updateMyProfile);

export default router;
