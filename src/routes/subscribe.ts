import { Router } from 'express';
import subscribeController from '../controllers/subscribeController'; // Sửa import

const router = Router();

router.post('/', subscribeController.subscribeWeather); // Gọi hàm subscribeWeather
router.get('/verify', subscribeController.verifyEmail); // Gọi hàm subscribeWeather
router.post('/unsub', subscribeController.unSubscribeWeather); // Gọi hàm subscribeWeather

export default router;
