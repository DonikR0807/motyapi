const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;
