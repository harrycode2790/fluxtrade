import mongoose from 'mongoose';
import { ENV } from './env.js';


const connectDB = async () => {
    try {
        const {MONGO_URI} = ENV;
        if (!MONGO_URI) throw new Error('MONGO_URI is not defined in environment variables');

        const conn = await mongoose.connect(MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

export default connectDB;