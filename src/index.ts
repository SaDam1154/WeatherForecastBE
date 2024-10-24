import express from 'express';
import dotenv from 'dotenv';
import route from './routes';
import connectDB from './configs/db';
import emailService from './services/emailService';

// Load các biến môi trường từ file .env
dotenv.config();

//Kết nối DB
connectDB();

// Khởi tạo ứng dụng express
const app = express();
app.use(express.json({ limit: '50mb' }));

// Middleware và routes
app.use('/api', route);

// Route mặc định kiểm tra server
app.get('/', (req, res) => {
    res.json('Backend WeatherCastfore SaDam is running!');
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Bắt đầu cron job
emailService.startScheduledTask();
