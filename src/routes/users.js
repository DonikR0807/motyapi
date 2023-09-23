import express from 'express';

import usersController from '../controllers/users.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.get('/users/me', usersController.getMe);

router.patch(
  '/users/me',
  upload.fields([
    {
      name: 'cover',
      maxCount: 1,
    },
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  usersController.updateProfile,
);

export default router;
