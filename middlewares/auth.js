const jsonwebtoken = require('jsonwebtoken');
const AuthError = require('../utils/errorClasses/AuthError');

const auth = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'access-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;
