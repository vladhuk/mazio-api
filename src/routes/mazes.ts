import { Router } from 'express';

const router = Router();

router.post('/');
router.get('/:id');
router.put('/:id');
router.delete('/:id');
router.post('/:id/publish');
router.put('/:id/publish');
router.post('/:id/like');
router.post('/:id/dislike');

export default router;
