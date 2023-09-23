import express from 'express';
import { errors, celebrate } from 'celebrate';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { errorLogger } from 'express-winston';
import cors from 'cors';

import logger from '../middlewares/logger.js';
import userRouter from './users.js';
import savedAnimesRouter from './savedAnimes.js';
import commentsRouter from './comments.js';
import tokenRouter from './tokens.js';
import NotFoundError from '../utils/errorClasses/NotFoundError.js';
import globalHandler from '../middlewares/globalHandler.js';
import corsOptions from '../utils/corsOptions.js';
import auth from '../middlewares/auth.js';
import commentController from '../controllers/comments.js';
import validators from '../utils/validators.js';

const router = express.Router();

router.use(logger.requestLogger);
router.use(cors(corsOptions));
router.options('*', cors(corsOptions));
router.use(bodyParser.json());
router.use(cookieParser());
router.use('/', tokenRouter);
router.get(
  '/comments/:animeId',
  celebrate(validators.getCommentsValidator),
  commentController.getComments,
);
router.use('/', auth);
router.use('/', userRouter);
router.use('/', savedAnimesRouter);
router.use('/', commentsRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Невалидный роут'));
});
router.use(errorLogger);
router.use(errors());
router.use(globalHandler);

export default router;
