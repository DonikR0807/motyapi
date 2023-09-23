import ERROR_CODES from '../errorCodes.js';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.NOT_FOUND_CODE;
  }
}

export default NotFoundError;
