const router = require('express').Router();
const { celebrate } = require('celebrate');
const { registerValidator, loginValidator } = require('../utils/validators');
const {
  register,
  login,
  logout,
  refresh,
} = require('../controllers/tokens');

router.post('/signup', celebrate(registerValidator), register);

router.post('/signin', celebrate(loginValidator), login);

router.post('/logout', logout);

router.get('/refresh', refresh);

module.exports = {
  tokenRouter: router,
};
