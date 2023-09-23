import express from 'express';
import { celebrate } from 'celebrate';
import commentController from '../controllers/comments.js';
import validators from '../utils/validators.js';

const { createComment } = commentController;
const { createCommentValidator } = validators;

const router = express.Router();

router.post('/comments', celebrate(createCommentValidator), createComment);

export default router;
