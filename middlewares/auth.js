const jsonwebtoken = require('jsonwebtoken');
const AuthError = require('../utils/errorClasses/AuthError');

const { NODE_ENV, JWT_ACCESS_SECRET } = process.env;

const auth = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(
      accessToken,
      NODE_ENV === 'production' ? JWT_ACCESS_SECRET : 'some-secret-key',
    );
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;
