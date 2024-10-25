import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import weatherServices from '../services/weatherService';
import cron from 'node-cron';
import { Subscriber } from '../models/Subscriber'; // Đảm bảo đường dẫn đúng đến model Subscriber

// Tạo transporter cho việc gửi email
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sadam01664@gmail.com',
            pass: 'atambptxgohcwlvq',
        },
    });
};

// Hàm gửi email thời tiết
const sendWeatherEmail = async (email: string, city: string) => {
    try {
        // Lấy dữ liệu thời tiết từ service
        const weatherData = await weatherServices.getWeatherByCity(city);

        // Thiết lập nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Weather Update for ${city}`,
            html: `
                <p>Here is your weather update for ${city}:</p>
                <p>Temperature: ${weatherData.temperature} °C</p>
                <p>Condition: ${weatherData.condition}</p>
                <p>Wind Speed: ${weatherData.wind_speed} kph</p>
                <p>Humidity: ${weatherData.humidity} %</p>
            `,
        };

        // Gửi email
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending weather email:', error);
    }
};

// Hàm gửi email xác nhận
const sendConfirmationEmail = async (email: string, token: string) => {
    try {
        const link = `${process.env.DOMAIN}/VerifyEmail/${token}`;
        const emailTemplate = fs.readFileSync(path.join(process.cwd(), 'src', 'services', 'verifyEmail.html'), 'utf-8');
        const emailContent = emailTemplate.replace('{{verification_link}}', link);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Please confirm your Email account',
            html: emailContent,
        };

        // Gửi email
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

// Hàm gửi email cho tất cả người đăng ký
const sendScheduledEmails = async () => {
    try {
        // Lấy tất cả subscriber đang hoạt động
        const subscribers = await Subscriber.find({ isActive: true });

        // Lặp qua từng subscriber và gửi email
        for (const subscriber of subscribers) {
            // Gửi email thông tin thời tiết
            await sendWeatherEmail(subscriber.email, subscriber.city);
        }

        console.log('Weather emails sent to subscribers.');
    } catch (error) {
        console.error('Error sending scheduled emails:', error);
    }
};

// Lên lịch gửi email mỗi 5 phút để kiểm tra thay vì mỗi ngày
const startScheduledTask = () => {
    cron.schedule('*/5 * * * *', () => {
        sendScheduledEmails();
    });
};

export default { sendConfirmationEmail, sendWeatherEmail, startScheduledTask };
