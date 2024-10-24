import axios from 'axios';

const getWeatherByCity = async (city: string) => {
    if (!city) {
        throw new Error('City must be provided');
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`);
        const weatherData = weatherResponse.data;

        // Kiểm tra xem dữ liệu thời tiết có hợp lệ không
        if (!weatherData || !weatherData.current) {
            throw new Error('No weather data available for the provided city');
        }

        return {
            temperature: weatherData.current.temp_c,
            condition: weatherData.current.condition.text,
            wind_speed: weatherData.current.wind_kph,
            humidity: weatherData.current.humidity,
        };
    } catch (error) {
        // Kiểm tra mã lỗi của phản hồi
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            if (status === 400) {
                throw new Error('Bad request. Please check the city name.');
            } else if (status === 404) {
                throw new Error('City not found. Please provide a valid city name.');
            }
        }

        console.error('Error fetching weather data:', error);
        throw new Error('Unable to fetch weather data');
    }
};

export default { getWeatherByCity };
