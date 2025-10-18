import exress from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';


const app = exress();

connectDB();

app.listen(ENV.PORT, () => {
    console.log('Server is running on port 5002');
})