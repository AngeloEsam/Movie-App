import express from 'express';
import {
  createMedia,
  getAllMedia,
  updateMedia,
  deleteMedia
} from '../controllers/media.controller';

const router = express.Router();

router.post('/', createMedia);
router.get('/', getAllMedia);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);

export default router;
