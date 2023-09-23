import ERROR_CODES from '../errorCodes.js';

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.INVALID_DATA_CODE;
  }
}

export default InvalidDataError;
