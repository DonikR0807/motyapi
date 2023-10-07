import mongoose from 'mongoose';
import urlExpression from '../utils/urlExpression.js';

const animeSchema = mongoose.Schema({
  names: {
    ru: {
      type: String,
      required: true,
    },
    status: {
      string: {
        type: String,
        required: true,
      },
    },
    posters: {
      small: {
        type: String,
        required: true,
        match: urlExpression,
      },
      medium: {
        type: String,
        required: true,
        match: urlExpression,
      },
      original: {
        type: String,
        required: true,
        match: urlExpression,
      },
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      string: {
        type: String,
        required: true,
      },
    },
    season: {
      year: {
        type: Number,
        required: true,
      },
      string: {
        type: String,
        required: true,
      },
    },
    player: {
      list: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    genres: [{ type: String, required: true }]
  },
});

const Anime = mongoose.model('Anime', animeSchema);

export default Anime;
