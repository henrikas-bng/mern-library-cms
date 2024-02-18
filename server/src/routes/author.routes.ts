import express from 'express';
import * as AuthorController from '../controllers/author.controller';

const router = express.Router();

router.get('/get/:authorId', AuthorController.getById);
router.get('/all', AuthorController.getAll);
router.post('/create', AuthorController.create);
router.post('/update/:authorId', AuthorController.update);
router.delete('/delete/:authorId', AuthorController.destroyById);

export default router;
