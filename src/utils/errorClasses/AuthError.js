import ERROR_CODES from '../errorCodes.js';

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.AUTH_ERROR_CODE;
  }
}

export default AuthError;
