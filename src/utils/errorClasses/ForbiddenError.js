import ERROR_CODES from '../errorCodes.js';

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.FORBIDDEN_ERROR_CODE;
  }
}

export default ForbiddenError;
