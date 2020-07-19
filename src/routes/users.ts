import { Router } from 'express';
import * as userController from '../controllers/UserController';

const router = Router();

router.get('/:id/friends', userController.getFriends);
router.post('/:id/friends', userController.addFriend);
router.delete('/:id/friends/:friendId', userController.deleteFriend);
router.get('/:id/ignored', userController.getIgnoredUsers);
router.post('/:id/ignored', userController.addIgnoredUser);
router.delete('/:id/ignored/:ignoredUserId', userController.deleteIgnoredUser);

export default router;
