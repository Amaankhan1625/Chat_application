import mongoose from "mongoose";

//function to connect mongodb database 
export const connectDB = async () => {
    try {

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });
        
       await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
    } 
    catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
};

export default connectDB;

