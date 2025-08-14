import mongoose from "mongoose";

const connectDB = async () => {
    console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debugging line
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;