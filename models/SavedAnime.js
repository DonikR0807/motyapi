const mongoose = require('mongoose');
const urlExpression = require('../utils/urlExpression');

const savedAnimeSchema = mongoose.Schema({
  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: String,
    required: true,
  },
  names: {
    ru: {
      type: String,
      required: true,
    },
  },
  status: {
    string: {
      type: String,
      required: true,
    },
  },
  genres: [{ type: String, required: true }],
  image: {
    type: String,
    required: true,
    match: urlExpression,
  },
  category: {
    type: String,
    required: true,
    enum: ['watched', 'planned'],
  },
});

const SavedAnime = mongoose.model('SavedAnime', savedAnimeSchema);

module.exports = SavedAnime;
