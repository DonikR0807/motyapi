const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  animeId: {
    type: Number,
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
