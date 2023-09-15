const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createComment, getComments } = require('../controllers/comments');
const { createCommentValidator, getCommentsValidator } = require('../utils/validators');

router.get('/comments/:animeId', celebrate(getCommentsValidator), getComments);

router.post('/comments', celebrate(createCommentValidator), createComment);

module.exports = {
  commentsRouter: router,
};
