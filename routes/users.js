const router = require('express').Router();
const { celebrate } = require('celebrate');
const { getMe, updateProfile } = require('../controllers/users');
const { updateProfileValidator } = require('../utils/validators');

router.get('/users/me', getMe);

router.patch('/users/me', celebrate(updateProfileValidator), updateProfile);

module.exports = {
  userRouter: router,
};
