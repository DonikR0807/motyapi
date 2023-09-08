const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const AuthError = require('../utils/errorClasses/AuthError');
const NotFoundError = require('../utils/errorClasses/NotFoundError');
const InvalidDataError = require('../utils/errorClasses/InvalidDataError');
const ConflictError = require('../utils/errorClasses/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const register = (req, res, next) => {
  const { password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => User.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => {
      let customError = err;
      if (err.name === 'ValidationError') {
        customError = new InvalidDataError('Переданы неверные данные');
      }
      if (err.name === 'MongoServerError') {
        customError = new ConflictError('Пользователь с таким email уже существует');
      }
      next(customError);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => {
      const { password: hash } = user;
      return bcrypt.compare(password, hash).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError('Неправильная почта или пароль'));
        }
        const token = jsonwebtoken.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
          {
            expiresIn: '7d',
          },
        );

        return res.send({ token });
      });
    })
    .catch((err) => {
      let customError = err;

      if (err.name === 'DocumentNotFoundError') {
        customError = new AuthError('Неправильная почта или пароль');
      }

      next(customError);
    });
};

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
  register,
  login,
  getMe,
  updateProfile,
};
