import ERROR_CODES from '../utils/errorCodes.js';

const { DEFAULT_ERROR_CODE } = ERROR_CODES;

const globalHandler = (err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === DEFAULT_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
  });

  next();
};

export default globalHandler;
