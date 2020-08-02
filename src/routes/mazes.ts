import { Router } from 'express';
import * as mazeController from '../controllers/MazeController';

const router = Router();

router.get('/', mazeController.getMazes);
router.get('/:id', mazeController.getMaze);

export default router;
