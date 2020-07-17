import { Router } from 'express';
import authRouter from './auth';
import usersRouter from './users';
import mazesRouter from './mazes';
import roomsRouter from './rooms';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/mazes', mazesRouter);
router.use('/rooms', roomsRouter);

export default router;
