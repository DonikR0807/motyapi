const router = require('express').Router();
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errorLogger } = require('express-winston');
const cors = require('cors');

const { requestLogger } = require('../middlewares/logger');
const { userRouter } = require('./users');
const NotFoundError = require('../utils/errorClasses/NotFoundError');
const globalHandler = require('../middlewares/globalHandler');
const corsOptions = require('../utils/corsOptions');
const { tokenRouter } = require('./tokens');
const auth = require('../middlewares/auth');

router.use(requestLogger);
router.use(cors(corsOptions));
router.options('*', cors(corsOptions));
router.use(bodyParser.json());
router.use(cookieParser());
router.use('/', tokenRouter);
router.use('/', auth);
router.use('/', userRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Невалидный роут'));
});
router.use(errorLogger);
router.use(errors());
router.use(globalHandler);

module.exports = {
  rootRouter: router,
};
