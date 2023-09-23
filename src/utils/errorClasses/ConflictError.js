import ERROR_CODES from '../errorCodes.js';

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.CONFLICT_ERROR_CODE;
  }
}

export default ConflictError;
