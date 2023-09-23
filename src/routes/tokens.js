import express from 'express';
import { celebrate } from 'celebrate';

import validators from '../utils/validators.js';
import tokenController from '../controllers/tokens.js';

const router = express.Router();

router.post(
  '/signup',
  celebrate(validators.registerValidator),
  tokenController.register,
);

router.post(
  '/signin',
  celebrate(validators.loginValidator),
  tokenController.login,
);

router.post('/logout', tokenController.logout);

router.get('/refresh', tokenController.refresh);

export default router;
