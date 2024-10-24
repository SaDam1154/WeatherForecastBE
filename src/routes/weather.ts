import { Router } from 'express';
const router = Router();

import weatherController from '../controllers/weatherController';

router.get('/current', weatherController.getCurrentWeather);
router.get('/forecast', weatherController.getWeatherForecast);

export default router;
