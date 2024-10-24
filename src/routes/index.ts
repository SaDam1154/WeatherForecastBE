import { Router } from 'express';
import weatherRouter from './weather';
import subscribeRouter from './subscribe';

const router = Router();

router.use('/weather', weatherRouter);
router.use('/subscribe', subscribeRouter);

export default router;
