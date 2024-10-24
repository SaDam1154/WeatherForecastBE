import { Request, Response } from 'express';
import { Subscriber } from '../models/Subscriber';
import emailService from '../services/emailService';
import crypto from 'crypto';

// [POST] api/subscribe
const subscribeWeather = async (req: Request, res: any) => {
    try {
        const { email, city } = req.body;

        if (!email || !city) {
            return res.status(400).json({
                success: false,
                message: 'Email and city are required.',
            });
        }

        const existingSubscriber = await Subscriber.findOne({ email });

        // Kiểm tra xem người dùng đã đăng ký và xác nhận rồi chưa.
        if (existingSubscriber) {
            console.log(existingSubscriber, ' are already subscribed ');
            if (existingSubscriber.isActive) {
                console.log(existingSubscriber, ' are already is active. ');
                return res.status(400).json({
                    success: false,
                    message: 'You are already subscribed and your email is active.',
                });
            } else {
                // Nếu email đã tồn tại nhưng chưa xác nhận, gửi email xác nhận lại
                const token = crypto.randomBytes(16).toString('hex');
                existingSubscriber.token = token; // Cập nhật token
                existingSubscriber.city = city; //Lấy thành địa chỉ mới
                await existingSubscriber.save(); // Lưu lại thông tin subscriber đã cập nhật

                // Gửi email xác nhận
                await emailService.sendConfirmationEmail(email, token);

                return res.status(200).json({
                    success: true,
                    message: 'Please check your email to confirm your subscription.',
                });
            }
        }

        // Nếu không tìm thấy email trong DB, tạo một subscriber mới
        const token = crypto.randomBytes(16).toString('hex');
        const subscriber = new Subscriber({ email, city, active: false, token });
        await subscriber.save();

        // Gửi email xác nhận
        await emailService.sendConfirmationEmail(email, token);

        return res.status(200).json({
            success: true,
            message: 'Subscription successful. Please check your email to confirm.',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/verify
const verifyEmail = async (req: Request, res: any) => {
    const { token } = req.query;

    const subscriber = await Subscriber.findOne({ token });

    if (!subscriber) {
        return res.status(400).json({ success: false, message: 'Invalid token.' });
    }

    subscriber.isActive = true; // Đặt trạng thái thành active
    subscriber.token = undefined; // Xóa token để không dùng lại
    await subscriber.save();

    return res.status(200).json({ success: true, message: 'Email has been successfully verified.' });
};

// Hủy đăng ký
const unSubscribeWeather = async (req: Request, res: any) => {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Subscriber not found.' });
    }

    subscriber.isActive = false; // Đặt trạng thái thành inactive
    await subscriber.save();

    return res.status(200).json({ success: true, message: 'You have been unsubscribed.' });
};

export default { subscribeWeather, verifyEmail, unSubscribeWeather };
