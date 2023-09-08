const router = require('express').Router();

const { createComment, getComments } = require('../controllers/comments');

router.get('/comments/:animeId', getComments);

router.post('/comments', createComment);

module.exports = {
  commentRouter: router,
};
