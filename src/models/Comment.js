import mongoose from 'mongoose';

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
    type: mongoose.ObjectId,
    ref: 'Anime',
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
