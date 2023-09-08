const { DEFAULT_ERROR_CODE } = require('../utils/errorCodes');

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

module.exports = globalHandler;
