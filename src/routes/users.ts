import { Router } from 'express';
import * as userController from '../controllers/UserController';

const router = Router();

router.get('/:id/friends', userController.getFriends);
router.post('/:id/friends', userController.addFriend);
router.delete('/:id/friends/:friendId', userController.deleteFriend);
router.get('/:id/ignored', userController.getIgnoredUsers);
router.post('/:id/ignored', userController.addIgnoredUser);
router.delete('/:id/ignored/:ignoredUserId', userController.deleteIgnoredUser);
router.post('/:id/liked-mazes', userController.addLikedMaze);
router.delete('/:id/liked-mazes/:mazeId', userController.removeLikedMaze);
router.post('/:id/disiked-mazes', userController.addDislikedMaze);
router.delete('/:id/disliked-mazes/:mazeId', userController.removeDislikedMaze);
router.get('/:id/mazes', userController.getMazes);
router.get('/:id/mazes', userController.createMaze);
router.delete('/:id/mazes/:mazesId', userController.getMaze);
router.delete('/:id/mazes/:mazesId', userController.updateMaze);
router.delete('/:id/mazes/:mazesId', userController.deleteMaze);
router.delete('/:id/mazes/:mazesId', userController.publishMaze);

export default router;
