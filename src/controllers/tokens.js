import { hash as _hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Token from '../models/Token.js';
import saveToken from '../utils/saveToken.js';
import createTokens from '../utils/createTokens.js';
import AuthError from '../utils/errorClasses/AuthError.js';
import ConflictError from '../utils/errorClasses/ConflictError.js';
import InvalidDataError from '../utils/errorClasses/InvalidDataError.js';

const register = async (req, res, next) => {
  const { email, password, userName } = req.body;
  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }

    const hash = await _hash(password, 10);
    const createdUser = await User.create({ email, password: hash, userName });
    const tokens = createTokens({ _id: createdUser._id });
    await saveToken(createdUser._id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.send({
      _id: createdUser._id,
      email: createdUser.email,
      userName: createdUser.userName,
      avatar: createdUser.avatar,
      cover: createdUser.cover,
    });
  } catch (err) {
    let customError = err;

    if (err.name === 'CastError' || err.name === 'ValidationError') {
      customError = new InvalidDataError('Переданы некорректные данные');
    }

    next(customError);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email }).select('+password');

    if (!foundUser) {
      throw new InvalidDataError('Пользователь с таким email не был найден');
    }

    const passwordsMatch = await compare(password, foundUser.password);

    if (!passwordsMatch) {
      throw new InvalidDataError('Введен неправильный пароль');
    }

    const tokens = createTokens({ _id: foundUser._id });
    await saveToken(foundUser._id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.send({
      _id: foundUser._id,
      email: foundUser.email,
      userName: foundUser.userName,
      avatar: foundUser.avatar,
      cover: foundUser.cover,
    });
  } catch (err) {
    let customError = err;

    if (err.name === 'CastError' || err.name === 'ValidationError') {
      customError = new InvalidDataError('Переданы некорректные данные');
    }

    next(customError);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AuthError('Пользователь не авторизован');
    }

    await Token.deleteOne({ refreshToken });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.send({
      message: 'Пользователь успешно разлогинился',
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AuthError('Пользователь не авторизован');
    }

    let _id;
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      _id = payload._id;
    } catch (_) {
      throw new AuthError('Невалидный или протухший токен');
    }

    const foundToken = await Token.findOne({ refreshToken });

    if (!foundToken) {
      throw new AuthError('Недействительный более токен');
    }

    const foundUser = await User.findById(_id);
    const tokens = createTokens({ _id: foundUser._id });
    await saveToken(foundUser._id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.send({
      _id: foundUser._id,
      email: foundUser.email,
      userName: foundUser.userName,
      avatar: foundUser.avatar,
      cover: foundUser.cover,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  register,
  login,
  logout,
  refresh,
};
