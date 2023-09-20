const User = require('../models/User');
const NotFoundError = require('../utils/errorClasses/NotFoundError');
const InvalidDataError = require('../utils/errorClasses/InvalidDataError');
const ConflictError = require('../utils/errorClasses/ConflictError');

const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    }))
    .catch((err) => {
      let customError = err;

      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Пользователь не найден');
      }

      next(customError);
    });
};

const updateProfile = (req, res, next) => {
  const { email, userName } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, userName },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    }))
    .catch((err) => {
      let customError = err;

      if (err.name === 'ValidationError' || err.name === 'CastError') {
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
