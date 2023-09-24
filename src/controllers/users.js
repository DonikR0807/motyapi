import User from '../models/User.js';
import NotFoundError from '../utils/errorClasses/NotFoundError.js';
import InvalidDataError from '../utils/errorClasses/InvalidDataError.js';
import ConflictError from '../utils/errorClasses/ConflictError.js';
import checkImage from '../utils/checkImage.js';
import { defaultAvatar, defaultCover } from '../utils/defaultImages.js';
import s3 from '../utils/objectStorage.js';

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { email, userName } = req.body;
    const { files } = req;
    const { cover, avatar } = files;

    const user = await User.findById(_id).orFail();

    if (cover) {
      const coverFile = cover[0];
      const { buffer: coverBuffer } = coverFile;
      await checkImage(coverBuffer);
      const upload = await s3.Upload(
        {
          buffer: coverBuffer,
        },
        '/users/covers/',
      );
      const { Location } = upload;
      if (user.cover !== defaultCover) {
        const path = user.cover.replace(
          'https://motyanime.storage.yandexcloud.net',
          '',
        );
        await s3.Remove(path);
      }
      user.cover = Location;
    }

    if (avatar) {
      const avatarFile = avatar[0];
      const { buffer: avatarBuffer } = avatarFile;
      await checkImage(avatarBuffer);
      const upload = await s3.Upload(
        {
          buffer: avatarBuffer,
        },
        '/users/avatars/',
      );
      const { Location } = upload;
      if (user.avatar !== defaultAvatar) {
        const path = user.avatar.replace(
          'https://motyanime.storage.yandexcloud.net',
          '',
        );
        await s3.Remove(path);
      }
      user.avatar = Location;
    }

    user.email = email;
    user.userName = userName;
    const updatedUser = await user.save();

    res.send({
      _id: updatedUser._id,
      email: updatedUser.email,
      userName: updatedUser.userName,
      avatar: updatedUser.avatar,
      cover: updatedUser.cover,
    });
  } catch (err) {
    let customError = err;

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные при обновлении профиля',
      );
    }

    if (err.name === 'DocumentNotFoundError') {
      customError = new NotFoundError(
        'Пользователь по указанному _id не найден',
      );
    }

    if (err.name === 'MongoServerError') {
      customError = new ConflictError(
        'Пользователь с таким email уже существует',
      );
    }

    next(customError);
  }
};

export default {
  updateProfile,
};
