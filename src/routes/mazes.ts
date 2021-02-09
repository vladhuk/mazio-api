import { Router } from 'express';
import * as mazeController from '../controllers/MazeController';

const router = Router();

/**
 * @swagger
 *
 * /api/mazes:
 *   get:
 *     description: Returns all published events unless type `DRAFT` is not specified in parameters.
 *       `DRAFT` mazes is available only for there owners.
 *     tags: [Maze]
 *     security:
 *       - {}
 *       - BearerAuth: []
 *     parameters:
 *       - name: type
 *         in: query
 *         schema:
 *           $ref: '#/components/schemas/MazeType'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Maze'
 */
router.get('/', mazeController.getMazes);

/**
 * @swagger
 *
 * /api/mazes/{id}:
 *   get:
 *     description: Returns maze by id. `DRAFT` mazes is available only for there owners.
 *     tags: [Maze]
 *     security:
 *       - {}
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maze'
 */
router.get('/:id', mazeController.getMaze);

export default router;
