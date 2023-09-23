import jwt from 'jsonwebtoken';
import AuthError from '../utils/errorClasses/AuthError.js';

const auth = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'access-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};

export default auth;
