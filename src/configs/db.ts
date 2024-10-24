import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING as string);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
        // Thoát khỏi process nếu có lỗi
        process.exit(1);
    }
};

export default connectDB;
