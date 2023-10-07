import Anime from '../models/Anime.js';
import SavedAnime from '../models/SavedAnime.js';
import ForbiddenError from '../utils/errorClasses/ForbiddenError.js';
import InvalidDataError from '../utils/errorClasses/InvalidDataError.js';
import NotFoundError from '../utils/errorClasses/NotFoundError.js';

const getSavedAnimes = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const savedAnimes = await SavedAnime.find({ owner: _id });
    res.send(savedAnimes);
  } catch (err) {
    let customError = err;

    if (err.name === 'CastError') {
      customError = new InvalidDataError('Передан неправильный Id');
    }

    next(customError);
  }
};

const saveAnime = async (req, res, next) => {
  const { _id } = req.user;
  const { animeId, category } = req.body;

  try {
    const foundAnime = await Anime.findById(animeId);
    if (!foundAnime) {
      throw new InvalidDataError("Аниме с таким id не был найден");
    }
    const savedAnime = await SavedAnime.findOne({ animeId, owner: _id });
    if (!savedAnime) {
      const savedAnime = await SavedAnime.create({ ...req.body, owner: _id });
      res.send(savedAnime);
    } else if (savedAnime.category !== category) {
      savedAnime.category = category;
      await savedAnime.save();
      res.send(savedAnime);
    } else {
      res.send(savedAnime);
    }
  } catch (err) {
    let customError = err;

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные при сохранении аниме',
      );
    }

    next(customError);
  }
};

const deleteAnime = async (req, res, next) => {
  const { _id } = req.user;
  const { animeId } = req.params;

  try {
    const savedAnime = await SavedAnime.findById(animeId).orFail();
    if (savedAnime.owner.toString() === _id) {
      return savedAnime.deleteOne().then(() => {
        res.send({ message: 'Аниме удалено' });
      });
    }
    throw new ForbiddenError('Нельзя удалить чужое аниме');
  } catch (err) {
    let customError = err;
    if (err.name === 'CastError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные для удаления аниме',
      );
    }

    if (err.name === 'DocumentNotFoundError') {
      customError = new NotFoundError('Аниме с указанным _id не найден');
    }

    return next(customError);
  }
};

export default {
  getSavedAnimes,
  saveAnime,
  deleteAnime,
};
