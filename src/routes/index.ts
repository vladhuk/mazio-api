import { Router } from 'express';
import authRouter from './auth';
import usersRouter from './users';
import mazesRouter from './mazes';
import roomsRouter from './rooms';
import { authRequired } from '../middlewares/authentication';
import userIdChecker from '../middlewares/userIdChecker';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', [authRequired, userIdChecker], usersRouter);
router.use('/mazes', mazesRouter);
router.use('/rooms', roomsRouter);

export default router;
