const User = require('../models/User');
const NotFoundError = require('../utils/errorClasses/NotFoundError');
const InvalidDataError = require('../utils/errorClasses/InvalidDataError');
const ConflictError = require('../utils/errorClasses/ConflictError');

const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      let customError = err;

      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Пользователь не найден');
      }

      next(customError);
    });
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      let customError = err;

      if (err.name === 'ValidationError') {
        customError = new InvalidDataError(
          'Переданы некорректные данные при обновлении профиля',
        );
      }

      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError(
          'Пользователь по указанному _id не найден',
        );
      }

      if (err.name === 'MongoServerError') {
        customError = new ConflictError('Пользователь с таким email уже существует');
      }

      next(customError);
    });
};

module.exports = {
  getMe,
  updateProfile,
};
