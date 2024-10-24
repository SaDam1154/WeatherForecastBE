import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho weather document (TypeScript)
interface IWeather extends Document {
    city: string;
    temperature: number;
    condition: string;
    date: Date;
}

// Định nghĩa schema cho weather
const weatherSchema: Schema = new mongoose.Schema({
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    condition: { type: String, required: true },
    date: { type: Date, default: Date.now }, // Ngày mặc định là hiện tại
});

// Tạo model
const Weather = mongoose.model<IWeather>('Weather', weatherSchema);

export default Weather;
