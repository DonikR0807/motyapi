const router = require('express').Router();
const { errors, celebrate } = require('celebrate');
const bodyParser = require('body-parser');
const { errorLogger } = require('express-winston');
const cors = require('cors');

const { requestLogger } = require('../middlewares/logger');
const { registerValidator, loginValidator } = require('../utils/validators');
const { register, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { userRouter } = require('./users');
const NotFoundError = require('../utils/errorClasses/NotFoundError');
const globalHandler = require('../middlewares/globalHandler');
const corsOptions = require('../utils/corsOptions');

router.use(requestLogger);
router.use(cors(corsOptions));
router.options('*', cors(corsOptions));
router.use(bodyParser.json());
router.post('/signup', celebrate(registerValidator), register);
router.post('/signin', celebrate(loginValidator), login);
router.use(auth);
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
