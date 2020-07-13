import { Router } from 'express';
import authRouter from './auth';
import mazesRouter from './mazes';
import friendsRouter from './friends';
import ignoredRouter from './ignored';
import roomsRouter from './rooms';

const router = Router();

router.use('/api');

router.use('/auth', authRouter);
router.use('/mazes', mazesRouter);
router.use('/friends', friendsRouter);
router.use('/ignored', ignoredRouter);
router.use('/rooms', roomsRouter);

export default router;
