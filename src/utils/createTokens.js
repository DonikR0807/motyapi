import jwt from 'jsonwebtoken';

const createTokens = (payload) => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'access-secret-key',
    { expiresIn: '15m' },
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    { expiresIn: '30d' },
  );

  return {
    accessToken,
    refreshToken,
  };
};

export default createTokens;
