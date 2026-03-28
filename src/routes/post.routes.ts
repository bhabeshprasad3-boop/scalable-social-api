import {Router} from 'express';
import { createPost,getAllPost,getSinglePost,deleteMyPost } from '../controllers/post.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';

const router = Router();



router.post('/create-posts',verifyJWT,upload.single('post'),createPost);
router.get('/see-post',verifyJWT,getAllPost);
router.get('/search-post/:postId',verifyJWT,getSinglePost);
router.delete('/delete-post/:postId',verifyJWT,deleteMyPost);


export default router; 