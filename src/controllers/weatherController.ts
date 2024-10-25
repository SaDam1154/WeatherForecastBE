import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Request, Response } from 'express-serve-static-core';

axios.defaults.timeout = 5000;
axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

// [GET] api/weather
const getCurrentWeather = async (req: Request, res: any) => {
    try {
        // Lấy city từ query parameter
        const city = req.query.city;

        if (!city) {
            return res.status(200).json({
                success: false,
                message: 'City is required in the query parameters',
            });
        }

        // Đặt API key từ weatherapi.com trong .env
        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Weather API key is missing in the environment variables',
            });
        }

        // Gọi API của weatherapi.com
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);

        // Dữ liệu thời tiết lấy được từ API
        const weatherData = weatherResponse.data;

        const currentWeather = {
            temperature: weatherData.current.temp_c,
            conditionText: weatherData.current.condition.text,
            conditionIcon: weatherData.current.condition.icon,
            wind_speed: weatherData.current.wind_kph,
            humidity: weatherData.current.humidity,
            city: weatherData.location.name,
            lastUpdated: weatherData.current.last_updated,
        };

        return res.status(200).json({
            success: true,
            currentWeather,
        });
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            // Xử lý lỗi không tìm thấy thành phố
            if (err.response.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'City not found. Please check the city name and try again.',
                });
            }
            // Xử lý lỗi 400 hoặc các lỗi khác từ API
            if (err.response.status === 400) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid city name or request parameters. Please check and try again.',
                });
            }
        }

        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/forecast
const getWeatherForecast = async (req: Request, res: any) => {
    try {
        const city = req.query.city as string;
        const days = parseInt(req.query.days as string) || 4; // Mặc định 4 ngày

        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'City is required in the query parameters',
            });
        }

        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Weather API key is missing in the environment variables',
            });
        }

        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days + 1}`);
        const weatherData = weatherResponse.data;

        const forecastWeather = weatherData.forecast.forecastday.slice(1).map((day: any) => ({
            date: day.date,
            temperature: day.day.avgtemp_c,
            conditionText: day.day.condition.text,
            conditionIcon: day.day.condition.icon,
            wind_speed: day.day.maxwind_kph,
            humidity: day.day.avghumidity,
        }));

        return res.status(200).json({
            success: true,
            forecastWeather,
            totalForecastDays: days,
        });
    } catch (err: unknown) {
        // Xử lý lỗi từ Axios
        if (axios.isAxiosError(err) && err.response) {
            // Xử lý lỗi không tìm thấy thành phố
            if (err.response.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'City not found. Please check the city name and try again.',
                });
            }
            // Xử lý lỗi 400 hoặc các lỗi khác từ API
            if (err.response.status === 400) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid city name or request parameters. Please check and try again.',
                });
            }
        }

        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export default { getCurrentWeather, getWeatherForecast };
