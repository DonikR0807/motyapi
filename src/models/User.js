import mongoose from 'mongoose';
import validator from 'validator';
import urlExpression from '../utils/urlExpression.js';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  userName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatar: {
    type: String,
    default:
      'https://storage.yandexcloud.net/motyanime/users/profilePicture/profile.png',
    match: urlExpression,
  },
  cover: {
    type: String,
    default:
      'https://storage.yandexcloud.net/motyanime/users/profileBackground/your_name.jpg',
    match: urlExpression,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
