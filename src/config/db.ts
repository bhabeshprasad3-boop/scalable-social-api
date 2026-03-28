import mongoose from "mongoose";


export const connectDB = async ()=>{
    try {
        const mongoURI = process.env.MONGO_URI

    if(!mongoURI){
        throw new Error(".MONGO_URI is not defined in env file")
    };

    const conn = await mongoose.connect(mongoURI,{
        dbName:"ts-auth"
    });
     console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDb Failed to Connect",error)
        process.exit(1)
    }

    
}