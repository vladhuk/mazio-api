import { Router } from 'express';

const router = Router();

router.get('/:id/friends');
router.post('/:id/friends');
router.delete('/:id/friends/:id');
router.get('/:id/ignored');
router.post('/:id/ignored');
router.delete('/:id/ignored/:id');

export default router;
