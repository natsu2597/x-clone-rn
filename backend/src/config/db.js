import mongoose from "mongoose";
import { ENV } from "./env.js";

if (!ENV.MONGO_URI) {
        console.error("MONGO_URI environment variable is not defined");
        process.exit(1);
    }

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connection to DB", error);
        process.exit(1);
    }
}