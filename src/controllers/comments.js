import Comment from '../models/Comment.js';
import InvalidDataError from '../utils/errorClasses/InvalidDataError.js';

const getComments = async (req, res, next) => {
  const { animeId } = req.params;

  try {
    const comments = await Comment.find({ animeId }).populate('owner');
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

const createComment = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const createdComment = await Comment({ ...req.body, owner: _id }).populate('owner');
    const savedComment = await createdComment.save();
    res.send(savedComment);
  } catch (err) {
    let customError = err;

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные при создании комментария',
      );
    }

    next(customError);
  }
};

export default {
  getComments,
  createComment,
};
