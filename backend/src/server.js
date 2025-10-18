import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';


const app = express();

const startServer = async() => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
                console.log(`Server is running on port ${ENV.PORT} `);
})
    } catch (error) {
        console.log("Failed to start the Server : ",error.message);
        process.exit(1);
    }
}

startServer();
