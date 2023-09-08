const Comment = require('../models/Comment');
const InvalidDataError = require('../utils/errorClasses/InvalidDataError');

const getComments = async (req, res, next) => {
  const { animeId } = req.params;

  try {
    const comments = await Comment.find({ animeId }).populate('owner');
    res.send(comments);
  } catch (err) {
    let customError = err;

    if (err.name === 'CastError') {
      customError = new InvalidDataError('Передан неправильный Id');
    }

    next(customError);
  }
};

const createComment = async (req, res, next) => {
  const { _id } = req.user;

  const createdComment = Comment({ ...req.body, owner: _id });

  try {
    const savedComment = await createdComment.save();
    res.send(savedComment);
  } catch (err) {
    let customError = err;

    if (err.name === 'ValidationError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные при создании комментария',
      );
    }

    if (err.name === 'CastError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные при создании комментария',
      );
    }

    next(customError);
  }
};

module.exports = {
  getComments,
  createComment,
};
