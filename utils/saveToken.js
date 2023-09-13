const Token = require('../models/Token');

const saveToken = async (userId, refreshToken) => {
  const foundToken = await Token.findOne({ owner: userId });

  if (foundToken) {
    foundToken.refreshToken = refreshToken;
    return foundToken.save();
  }

  return Token.create({ owner: userId, refreshToken });
};

module.exports = saveToken;
