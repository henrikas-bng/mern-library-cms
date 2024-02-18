import express from 'express';
import * as BookController from '../controllers/book.controller';

const router = express.Router();

router.get('/get/:bookId', BookController.getById);
router.get('/all', BookController.getAll);
router.get('/all/:authorId', BookController.getAllByAuthorId);
router.post('/create', BookController.create);
router.post('/update/:bookId', BookController.update);
router.delete('/delete/:bookId', BookController.destroyById);

export default router;
