const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createComment } = require('../controllers/comments');
const { createCommentValidator } = require('../utils/validators');

router.post('/comments', celebrate(createCommentValidator), createComment);

module.exports = {
  commentsRouter: router,
};
