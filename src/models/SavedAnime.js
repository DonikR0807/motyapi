import mongoose from 'mongoose';
import urlExpression from '../utils/urlExpression.js';

const savedAnimeSchema = mongoose.Schema({
  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: mongoose.ObjectId,
    ref: 'Anime',
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

export default SavedAnime;
