
import express from 'express'
import authRouter from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import userRouter from './routes/user.route'
import cookieParser from 'cookie-parser'
import {rateLimit} from 'express-rate-limit';
import postRouter from './routes/post.routes';


const app = express()

app.use(express.json())
app.use(cookieParser())

const limiter = rateLimit({
    windowMs: 5*60*1000,
    limit:10,
    message:"To many request, try after sometime..."

})

app.use(limiter)


app.use("/api/auth/",authRouter);
app.use('/api/v1/',userRouter);
app.use('/api/v1/',postRouter)



app.get('/',(req,res)=>{
    res.send("api running..")
})

app.use(errorHandler);


export default app;
