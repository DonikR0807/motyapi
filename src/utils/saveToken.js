import Token from '../models/Token.js';

const saveToken = async (userId, refreshToken) => {
  const foundToken = await Token.findOne({ owner: userId });

  if (foundToken) {
    foundToken.refreshToken = refreshToken;
    return foundToken.save();
  }

  return Token.create({ owner: userId, refreshToken });
};

export default saveToken;
