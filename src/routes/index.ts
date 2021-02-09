import { Router } from 'express';
import authRouter from './auth';
import usersRouter from './users';
import mazesRouter from './mazes';
import roomsRouter from './rooms';
import { authOptional, authRequired } from '../middlewares/authentication';
import userIdChecker from '../middlewares/userIdChecker';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', [authRequired, userIdChecker], usersRouter);
router.use('/mazes', [authOptional], mazesRouter);
router.use('/rooms', roomsRouter);

export default router;
