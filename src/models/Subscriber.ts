import mongoose, { Schema, Document } from 'mongoose';

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    token: { type: String },
});

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
