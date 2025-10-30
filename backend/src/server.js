import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";
import  userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import searchRoutes from "./routes/search.route.js";

const app = express();


app.use(cors());
app.use(express.json());


app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Hello from server"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err,req,res, next) => {
    console.error("Unhandled error: ",err);
    res.status(500).json({ error : "Internal Server Error"});
})

const startServer = async() => {
    try {
        await connectDB();
        
        if(ENV.NODE_ENV !== "production"){
            app.listen(ENV.PORT, () => {
                console.log(`Server is running on port ${ENV.PORT} `);
            });
        }
    } catch (error) {
        console.error("Failed to start the Server : ",error.message);
        process.exit(1);
    }
}

startServer();

export default app;
